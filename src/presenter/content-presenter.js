import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import FilterModel from '../model/filter-model.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointModel from '../model/waypoint-model.js';
import SortContainerView from '../view/sort-container-view.js';
import { FilterType, newWaypoint, SortType, UpdateType, UserAction } from '../const.js';
import SortModel from '../model/sort-model.js';
import { remove, replace } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripModel from '../model/trip-model.js';
import NewPointPresenter from './new-point-presenter.js';
import { filter } from '../utils/util-filter.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  ADDING : 'ADDING'
};

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #tripComponent = null;
  #filterComponent = null;
  #sortingComponent = null;
  #contentContainer = null;
  #tripContainer = null;
  #filterModel = null;
  #sortingModel = new SortModel();
  #tripModel = null;
  #checkedFilter = null;
  #waypointsByCheckedFilter = null;
  #waypointPresentersList = new Map();
  #newWaypointPresenterList = new Map();
  #waypointModel = null;
  #sortingsContainer = null;
  #currentSortType = SortType.DAY;
  #filters = null;
  #sortings = null;
  #trip = null;
  #addButton = null;
  #mode = Mode.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #messageComponent = null;
  #newWaypointPresenter = null;
  #filterPresenter = null;

  constructor({ contentContainer, sortingsContainer, tripContainer, waypointModel, filterModel, filterPresenter}) {
    this.#contentContainer = contentContainer;
    this.#sortingsContainer = sortingsContainer;
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterModel = filterModel;
    this.#filterPresenter = filterPresenter;
    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #renderSortings(){
    this.#sortingComponent = new SortContainerView({
      sortTypes: this.#sortingModel.sortings,
      selectedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange});
      render(this.#sortingComponent, this.#sortingsContainer);
  }

  #handleSortTypeChange = (sortType, updatedSorting) => {
    if(this.#currentSortType === sortType){
      return;
    }

    this.#currentSortType = sortType;
    this.#clearContentContainer();
    this.#renderContentContainer();
  };

  #renderPoints(waypoints){
    for (let i = 0; i < waypoints.length; i++) {
      this.#renderPoint(waypoints[i]);
    }
  }

  #renderPoint(point) {
    const waypointPresenter = new WaypointPresenter({
      newWaypointPresenterList: this.#newWaypointPresenterList,
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

  #handleModeChange = () => {
    this.#waypointPresentersList.forEach((presenter) => presenter.resetView());
  };

  #renderTrip(){
    const tripModel = new TripModel(this.waypoints);
    let trip = tripModel.trip;
    const defaultTrip = {
      cost: 0,
      dates: '',
      template: ''
    }
    if(this.waypoints.length === 0){
      trip = defaultTrip;
    }
    this.#tripComponent = new TripInfoView({trip: trip});
    render(this.#tripComponent, this.#tripContainer,'AFTERBEGIN');
  }

  #initNewPointComponent(){
    const offersByType = newWaypoint.offersByType([...this.#waypointModel.offers]);
    this.newWaypoint = {
      ...newWaypoint,
      allDestinations: [...this.#waypointModel.destinations],
      allOffers: [...this.#waypointModel.offers],
      destination: [...this.#waypointModel.destinations][0],
      offersByType: offersByType,
      dateFrom: new Date(),
      dateTo: new Date()
    };

    this.#newWaypointPresenter = new NewPointPresenter({
      newWaypointContainer: this.#boardComponent.element,
      onCancelClick: this.#handleCancelClick,
      onSaveClick: this.#handleSaveClick
    });

    this.#newWaypointPresenter.init(this.newWaypoint, this.#mode);
    this.#newWaypointPresenterList.set(this.newWaypoint.id, this.#newWaypointPresenter);
  }

  #handleCancelClick = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#addButton.disabled = false;
    this.#initNewPointComponent();
  };

  #handleSaveClick = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
    this.#addButton.disabled = false;
    this.#initNewPointComponent();
  };

  #addPointClickHandler = (evt) => {
    evt.preventDefault();
    this.#addButton.disabled = true;
    this.#mode = Mode.ADDING;
    this.#filterType = FilterType.EVERYTHING;
    this.#filterPresenter.setFilter(this.#filterType);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#initNewPointComponent();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#addButton.disabled = false;
      this.#mode = Mode.DEFAULT;
      this.#newWaypointPresenterList.forEach((presenter) => presenter.destroy());
      this.#initNewPointComponent();
    }
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
      };
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
        this.#clearContentContainer({resetSortType: true});
        this.#renderContentContainer();
        break;  
      };
  };

  get waypoints(){
    this.#filterType = this.#filterModel.filter;
    const waypoints = this.#waypointModel.humanizedWaypoints;
    const filteredWaypoints = filter[this.#filterType](waypoints);
    return [...this.#waypointModel.sortWaypoints(filteredWaypoints, this.#currentSortType)];
  }

  #clearContentContainer({resetSortType = false, resetFilterType = false} = {}) {
    this.#waypointPresentersList.forEach((presenter) => presenter.destroy());
    this.#waypointPresentersList.clear();
    remove(this.#sortingComponent);
    remove(this.#tripComponent);

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
    this.#filterPresenter.init();
    this.#renderSortings();
    render(this.#boardComponent, this.#contentContainer);
    this.#renderPoints(this.waypoints);
    
    this.#renderTrip();

    const waypoints = this.waypoints;

    if(waypoints.length === 0){
      this.#renderMessage();
    }
  }
  init() {
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#addPointClickHandler);
    this.#initNewPointComponent();
    this.#renderContentContainer();
  }
}
