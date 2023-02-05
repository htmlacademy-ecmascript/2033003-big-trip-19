import { remove, render } from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import SortContainerView from '../view/sort-container-view.js';
import LoadingView from '../view/loading-view.js';
import TripInfoView from '../view/trip-info-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter } from '../utils/util-filter.js';
import { humanizeWaypointDate} from '../utils/util-waypoint.js';
import { sortTypes } from '../utils/util-sort.js';
import { FilterType, SortType, TimeLimit, UpdateType, UserAction } from '../const.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #loadingComponent = new LoadingView();
  #waypointPresentersList = new Map();
  #tripComponent = null;
  #sortingComponent = null;
  #messageComponent = null;
  #contentContainer = null;
  #sortingsContainer = null;
  #tripContainer = null;
  #filterModel = null;
  #waypointModel = null;
  #newWaypointPresenter = null;
  #newWaypoint = null;
  #isLoading = true;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
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

  createNewWaypoint() {
    this.#newWaypoint = {...this.#waypointModel.newHumanizedWaypoint, dateFrom: new Date(), dateTo: new Date()};
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newWaypointPresenter.init(this.#newWaypoint);
  }

  destroyMessage(){
    if(this.#messageComponent){
      remove(this.#messageComponent);
    }
  }

  renderMessage(){
    this.#messageComponent = new MessageView({filterType: this.#filterType});
    render(this.#messageComponent, this.#contentContainer);
  }

  #clearContentContainer({resetSortType = false, resetFilterType = false} = {}) {
    this.#waypointPresentersList.forEach((presenter) => presenter.destroy());
    this.#waypointPresentersList.clear();
    remove(this.#sortingComponent);
    remove(this.#tripComponent);
    remove(this.#loadingComponent);

    this.#currentSortType = resetSortType ? SortType.DAY : this.#currentSortType;
    this.#filterType = resetFilterType ? FilterType.EVERYTHING : this.#filterType;

    if(this.#messageComponent){
      this.destroyMessage();
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

    this.#renderTripInfo();

    if(waypoints.length === 0){
      this.renderMessage();
    }
  }

  #renderLoading(){
    render(this.#loadingComponent, this.#contentContainer);
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

  #renderTripInfo(){
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

    const offersCost = filteredWaypoints.map(({ offers }) => offers.reduce((sum, { price }) => sum + price, 0)).reduce((sum, price) => sum + price, 0);
    const baseCost = filteredWaypoints.map(({ basePrice }) => basePrice).reduce((sum, price) => sum + price, 0);
    trip.cost = offersCost + baseCost;

    return trip;
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
    this.#newWaypointPresenter.destroy();
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
