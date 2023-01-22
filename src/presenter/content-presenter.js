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
  #waypointPresenters = new Map();
  #newWaypointPresenter = new Map();
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

  constructor({ contentContainer, sortingsContainer, tripContainer, waypointModel, filterModel}) {
    this.#contentContainer = contentContainer;
    this.#sortingsContainer = sortingsContainer;
    this.#tripContainer = tripContainer;
    this.#waypointModel = waypointModel;
    this.#filterModel = filterModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  // #setupFilters(){
  //   this.#filterModel = new FilterModel({waypoints: this.waypoints});
  //   this.#filters = [...this.#filterModel.humanizedFilters];
  //   this.#filterComponent = new FilterContainerView({
  //     filters: this.#filters
  //   });
  //   render(this.#filterComponent, this.#filtersContainer);
  // }

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
    waypointPresenter.init({...point, allOffers: [...this.#waypointModel.offers]});
    this.#waypointPresenters.set(point.id, waypointPresenter);
  }

  #renderMessage(){
    this.#messageComponent = new MessageView({filterType: this.#filterType});
    render(this.#messageComponent, this.#contentContainer);
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

  #renderTrip(){
    const tripModel = new TripModel(this.waypoints);
    const trip = tripModel.trip;
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

  #clearContentContainer({resetSortType = false} = {}) {
    const waypointCount = this.waypoints.length;
    this.#waypointPresenters.forEach((presenter) => presenter.destroy());
    this.#waypointPresenters.clear();
    remove(this.#tripComponent);
    //remove(this.#noTaskComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }

    if(this.#messageComponent){
      remove(this.#messageComponent);
    }
  }

  #renderContentContainer() {
    this.#setupSortings(this.#sortings, this.#currentSortType);
    render(this.#boardComponent, this.#contentContainer);
    this.#renderPoints(this.waypoints);
    
    this.#renderTrip();

    const waypoints = this.waypoints;

    if(waypoints.length === 0){
      this.#renderMessage(this.checkedFilter);
    }
  }
  init() {
    this.#sortings = [...this.#sortingModel.humanizedSortings];
    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#addPointClickHandler);
    this.#renderContentContainer();
    this.#initNewPointComponent();
  }
}
