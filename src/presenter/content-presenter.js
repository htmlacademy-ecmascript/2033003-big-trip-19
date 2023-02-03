import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import SortContainerView from '../view/sort-container-view.js';
import { FilterType, SortType, TimeLimit, UpdateType, UserAction } from '../const.js';
import { remove, render } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter } from '../utils/util-filter.js';
import LoadingView from '../view/loading-view.js';
import { humanizeWaypointDate, newWaypoint } from '../utils/util-waypoint.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortTypes } from '../utils/util-sort.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #tripComponent = null;
  #sortingComponent = null;
  #contentContainer = null;
  #tripContainer = null;
  #filterModel = null;
  #waypointPresentersList = new Map();
  #newWaypointPresenterList = new Map();
  #waypointModel = null;
  #sortingsContainer = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #messageComponent = null;
  #newWaypointPresenter = null;
  #newWaypoint = null;
  #isLoading = true;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ contentContainer, sortingsContainer, tripContainer, waypointModel, filterModel, onNewWaypointDestroy}) {
    this.#contentContainer = contentContainer;
    this.#sortingsContainer = sortingsContainer;
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterModel = filterModel;

    this.#newWaypointPresenter = new NewPointPresenter({
      newWaypointContainer: this.#boardComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewWaypointDestroy
    });

    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get waypoints(){
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointModel.humanizedWaypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);
    return [...this.#waypointModel.sortWaypoints(filteredWaypoints, this.#currentSortType)];
  }

  init() {
    this.#renderContentContainer();
  }

  createWaypoint() {
    const offersByType = newWaypoint.offersByType([...this.#waypointModel.offers]);

    const destinations = this.#waypointModel.destinations;
    this.#newWaypoint = {
      ...newWaypoint,
      allDestinations: destinations,
      allOffers: [...this.#waypointModel.offers],
      destination: destinations[0],
      offersByType: offersByType.offers,
      dateFrom: new Date(),
      dateTo: new Date(),
      isFavorite: false,
      allDestinationNames: this.#waypointModel.cities,
    };
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newWaypointPresenter.init(this.#newWaypoint);
  }

  #renderSortings(){
    this.#sortingComponent = new SortContainerView({
      sortTypes: sortTypes,
      selectedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortingComponent, this.#sortingsContainer);
  }

  #renderPoints(waypoints){
    waypoints.forEach((waypoint) => this.#renderPoint(waypoint));
  }

  #renderPoint(point) {
    const waypointPresenter = new WaypointPresenter({
      newWaypointPresenter: this.#newWaypointPresenter,
      waypointContainer: this.#boardComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction});
    waypointPresenter.init({...point});
    this.#waypointPresentersList.set(point.id, waypointPresenter);
  }

  #renderMessage(){
    this.#messageComponent = new MessageView({filterType: this.#filterType});
    render(this.#messageComponent, this.#contentContainer);
  }

  #renderTrip(){
    const trip = this.waypoints.length === 0
      ? {cost: 0, dates: '', template: ''}
      : this.#returnTripInfo();
    this.#tripComponent = new TripInfoView({trip: trip});
    render(this.#tripComponent, this.#tripContainer, 'AFTERBEGIN');
  }

  #returnTripInfo(){
    const filteredWaypoints = filter[this.#filterType](this.#waypointModel.humanizedWaypoints);
    const trip = {};

    if (filteredWaypoints.length === 0) {
      return trip;
    }

    const [firstWaypoint, ...otherWaypoints] = filteredWaypoints;
    const lastWaypoint = filteredWaypoints[filteredWaypoints.length - 1];

    if (filteredWaypoints.length > 3) {
      trip.template = `${firstWaypoint.destination.name} — ... — ${lastWaypoint.destination.name}`;
    } else {
      const destinationNames = otherWaypoints.map(({ destination }) => destination.name);
      trip.template = [firstWaypoint.destination.name, ...destinationNames].join(' — ');
    }

    trip.dates = `${humanizeWaypointDate(firstWaypoint.dateFrom)} - ${humanizeWaypointDate(lastWaypoint.dateTo)}`;
    trip.cost = filteredWaypoints.reduce((sum, { basePrice }) => sum + basePrice, 0);

    return trip;
  }

  #renderLoading(){
    render(this.#loadingComponent, this.#contentContainer);
  }

  #clearContentContainer({resetSortType = false, resetFilterType = false} = {}) {
    this.#waypointPresentersList.forEach((presenter) => presenter.destroy());
    this.#waypointPresentersList.clear();
    remove(this.#sortingComponent);
    remove(this.#tripComponent);
    remove(this.#loadingComponent);
    this.#newWaypointPresenterList.clear();

    this.#currentSortType = resetSortType ? SortType.DAY : this.#currentSortType;
    this.#filterType = resetFilterType ? FilterType.EVERYTHING : this.#filterType;

    if(this.#messageComponent){
      remove(this.#messageComponent);
    }
  }

  #renderContentContainer() {
    if(this.#isLoading){
      this.#renderLoading();
      return;
    }
    const waypoints = this.waypoints;
    if(waypoints.length !== 0){
      this.#renderSortings();
    }

    render(this.#boardComponent, this.#contentContainer);

    this.#renderPoints(this.waypoints);

    this.#renderTrip();

    if(waypoints.length === 0){
      this.#renderMessage();
    }
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearContentContainer();
    this.#renderContentContainer();
  };

  #handleModeChange = () => {
    this.#waypointPresentersList.forEach((presenter) => presenter.resetView());
    this.#newWaypointPresenterList.forEach((presenter) => presenter.destroy());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch(actionType){
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointPresentersList.get(update.id).setSaving();
        try {
          await this.#waypointModel.updateWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresentersList.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_WAYPOINT:
        this.#newWaypointPresenter.setSaving();
        try {
          await this.#waypointModel.addWaypoint(updateType, update).then(() => {this.#newWaypointPresenter.destroy();});
        } catch(err) {
          this.#newWaypointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointPresentersList.get(update.id).setDeleting();
        try {
          await this.#waypointModel.deleteWaypoint(updateType, update);
        } catch(err) {
          this.#waypointPresentersList.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        this.#waypointPresentersList.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearContentContainer();
        this.#renderContentContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearContentContainer({resetSortType: true, resetFilterType:true});
        this.#renderContentContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.init();
        break;
    }
  };
}
