import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import SortContainerView from '../view/sort-container-view.js';
import { FilterType, SortType, UpdateType, UserAction } from '../const.js';
import SortModel from '../model/sort-model.js';
import { remove, render } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripModel from '../model/trip-model.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter } from '../utils/util-filter.js';
import { nanoid } from 'nanoid';
import LoadingView from '../view/loading-view.js';
import { newWaypoint } from '../utils/util-waypoint.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #tripComponent = null;
  #sortingComponent = null;
  #contentContainer = null;
  #tripContainer = null;
  #filterModel = null;
  #sortingModel = new SortModel();
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
      id: nanoid(),
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
      sortTypes: this.#sortingModel.sortings,
      selectedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortingComponent, this.#sortingsContainer);
  }

  #renderPoints(waypoints){
    for (let i = 0; i < waypoints.length; i++) {
      this.#renderPoint(waypoints[i]);
    }
  }

  #renderPoint(point) {
    const waypointPresenter = new WaypointPresenter({
      newWaypointPresenter: this.#newWaypointPresenter,
      waypointContainer: this.#boardComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction});
    waypointPresenter.init({...point, allOffers: [...this.#waypointModel.offers]});
    this.#waypointPresentersList.set(point.id, waypointPresenter);
  }

  #renderMessage(){
    this.#messageComponent = new MessageView({filterType: this.#filterType});
    render(this.#messageComponent, this.#contentContainer);
  }

  #renderTrip(){
    const tripModel = new TripModel(this.waypoints);
    let trip = tripModel.trip;

    const defaultTrip = {
      cost: 0,
      dates: '',
      template: ''
    };

    if(this.waypoints.length === 0){
      trip = defaultTrip;
    }
    this.#tripComponent = new TripInfoView({trip: trip});
    render(this.#tripComponent, this.#tripContainer,'AFTERBEGIN');
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

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (resetFilterType) {
      this.#filterType = FilterType.EVERYTHING;
    }

    if(this.#messageComponent){
      remove(this.#messageComponent);
    }
  }

  #renderContentContainer() {
    if(this.#isLoading){
      this.#renderLoading();
      return;
    }

    this.#renderSortings();

    render(this.#boardComponent, this.#contentContainer);

    this.#renderPoints(this.waypoints);

    this.#renderTrip();

    const waypoints = this.waypoints;

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

  #handleViewAction = (actionType, updateType, update) => {
    switch(actionType){
      case UserAction.UPDATE_WAYPOINT:
        this.#waypointModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD_WAYPOINT:
        this.#waypointModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE_WAYPOINT:
        this.#waypointModel.deleteWaypoint(updateType, update);
        break;
    }
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
