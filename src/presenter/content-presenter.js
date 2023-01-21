import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import FilterModel from '../model/filter-model.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointModel from '../model/waypoint-model.js';
import SortContainerView from '../view/sort-container-view.js';
import { newWaypoint, SortType, UpdateType, UserAction } from '../const.js';
import SortModel from '../model/sort-model.js';
import { replace } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripModel from '../model/trip-model.js';
import NewPointPresenter from './new-point-presenter.js';

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
  #filtersContainer = null;
  #tripContainer = null;
  #filterModel = null;
  #sortingModel = new SortModel();
  #tripModel = null;
  #checkedFilter = null;
  #waypointsByCheckedFilter = null;
  #waypointPresenters = new Map();
  #newWaypointPresenter = new Map();
  #waypointModel = new WaypointModel();
  #sortingsContainer = null;
  #currentSortType = SortType.DAY;
  #filters = null;
  #sortings = null;
  #trip = null;
  #addButton = null;
  #mode = Mode.DEFAULT;

  constructor({ contentContainer, filtersContainer, sortingsContainer, tripContainer}) {
    this.#contentContainer = contentContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortingsContainer = sortingsContainer;
    this.#tripContainer = tripContainer;

    this.#waypointModel.addObserver(this.#handleModelEvent);
  }

  #setupFilters(){
    this.#filterModel = new FilterModel({waypoints: this.waypoints});
    this.#filters = [...this.#filterModel.humanizedFilters];
    this.#filterComponent = new FilterContainerView({
      filters: this.#filters
    });
    render(this.#filterComponent, this.#filtersContainer);
  }

  #setupSortings(sortings, selectedSortType){
    const prevSortComponent = this.#sortingComponent;
    this.#currentSortType = selectedSortType;
    this.#sortingComponent = new SortContainerView({
      sortings: sortings,
      selectedSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange});
    if(prevSortComponent !== null){
      replace(this.#sortingComponent, prevSortComponent);
    }else{
      render(this.#sortingComponent, this.#sortingsContainer);
    }
  }

  #handleSortTypeChange = (sortType, updatedSorting) => {
    if(this.#currentSortType === sortType){
      return;
    }
    this.#sortings = updateItem(this.#sortings, updatedSorting);
    this.#sortings.forEach((sorting) => {
      if(sorting.name !== sortType){
        sorting.isChecked = false;
      }
    });
    this.#currentSortType = sortType;
    this.#setupSortings(this.#sortings, sortType);
    this.#clearWaypointsList();
    this.#renderPoints(this.waypoints);
  };

  #renderContentContainer(){
    render(this.#boardComponent, this.#contentContainer);
  }

  #getCurrentFilterAndWaypoints(){
    this.#checkedFilter = this.#filterComponent.selectedFilter;
    this.#waypointsByCheckedFilter = this.#checkedFilter.waypoints;
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
    waypointPresenter.init(point);
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #renderMessage(filter){
    const messageComponent = new MessageView({message: filter.message});
    render(messageComponent, this.#contentContainer);
  }

  #clearWaypointsList = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
  };

  #handleModeChange = () => {
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleWaypointChange = ( userAction, updateType, updatedWaypoint) => {
    //this.#humanizedWaypoints = updateItem(this.#humanizedWaypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #renderTrip(trip){
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

    const newWaypointPresenter = new NewPointPresenter({
      newWaypointContainer: this.#boardComponent.element,
      onCancelClick: this.#handleCancelClick,
      onSaveClick: this.#handleSaveClick
    });

    newWaypointPresenter.init(this.newWaypoint, this.#mode);
    this.#newWaypointPresenter.set(this.newWaypoint.id, newWaypointPresenter);
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
    this.#waypointPresenters.forEach((presenter) => presenter.resetView());
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#initNewPointComponent();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#addButton.disabled = false;
      this.#mode = Mode.DEFAULT;
      this.#newWaypointPresenter.forEach((presenter) => presenter.destroy());
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
      case UserAction.ADD_WAYPOINT:
        this.#waypointModel.deleteWaypoint(updateType, update);
        break;  
      };
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType){
      case UpdateType.PATCH:
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#waypointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        
        break;  
      };
  };

  get waypoints(){
    return [...this.#waypointModel.sortWaypoints(this.#waypointModel.humanizedWaypoints, this.#currentSortType)];
  }
  init() {
    this.#sortings = [...this.#sortingModel.humanizedSortings];
    this.#setupFilters();
    this.#setupSortings(this.#sortings, this.#currentSortType);
    this.#renderContentContainer();
    this.#getCurrentFilterAndWaypoints();

    if(this.#waypointsByCheckedFilter.length < 1){
      this.#renderMessage(this.checkedFilter);
    }else{
      this.#renderPoints(this.#waypointsByCheckedFilter);
    }

    this.#tripModel = new TripModel(this.waypoints);
    this.#trip = this.#tripModel.trip;
    this.#renderTrip(this.#trip);

    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#addPointClickHandler);

    this.#initNewPointComponent();
  }
}
