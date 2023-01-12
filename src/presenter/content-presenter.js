import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import FilterModel from '../model/filter-model.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointModel from '../model/waypoint-model.js';
import { updateItem } from '../utils/common.js';
import SortContainerView from '../view/sort-container-view.js';
import { SortType } from '../const.js';
import { sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice } from '../utils/util-waypoint.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #filterComponent = null;
  #contentContainer = null;
  #filtersContainer = null;
  #filterModel = null;
  #humanizedWaypoints = [];
  #checkedFilter = null;
  #waypointsByCheckedFilter = null;
  #waypointPresenters = new Map();
  #waypointModel = new WaypointModel();
  #sortingsContainer = null;
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedWaypoints = [];

  constructor({ contentContainer, filtersContainer, sortingsContainer}) {
    this.#contentContainer = contentContainer;
    this.#filtersContainer = filtersContainer;
    this.#sortingsContainer = sortingsContainer;
  }

  #setupFilters(){
    this.#filterModel = new FilterModel({waypoints: this.#humanizedWaypoints});
    this.filters = [...this.#filterModel.humanizedFilters];
    this.#filterComponent = new FilterContainerView({
      filters: this.filters
    });
    this.#renderFilters(this.#filterComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType){
      return;
    }
    this.#sortWaypoints(sortType);
    this.#clearWaypointsList();
    this.#renderPoints();
  };

  #sortWaypoints(sortType){
    switch(sortType){
      case SortType.DAY:
        this.#humanizedWaypoints.sort(sortWaypointByDate);
        break;
      case SortType.TIME:
        this.#humanizedWaypoints.sort(sortWaypointByDuration);
        break;
      case SortType.PRICE:
        this.#humanizedWaypoints.sort(sortWaypointByPrice);
        break;
      default:
        this.#humanizedWaypoints = [...this.#sourcedWaypoints];
    }
    this.#currentSortType = sortType;
  }

  #renderSortings(){
    this.#sortComponent = new SortContainerView({sortings: SortType, onSortTypeChange: this.#handleSortTypeChange});
    render(this.#sortComponent, this.#sortingsContainer);
  }

  #renderFilters(component){
    render(component, this.#filtersContainer);
  }

  #renderContentContainer(){
    render(this.#boardComponent, this.#contentContainer);
  }

  #getCurrentFilterAndWaypoints(){
    this.#checkedFilter = this.#filterComponent.selectedFilter;
    this.#waypointsByCheckedFilter = this.#checkedFilter.waypoints;
  }

  #renderPoints(){
    for (let i = 0; i < this.#waypointsByCheckedFilter.length; i++) {
      this.#renderPoint(this.#waypointsByCheckedFilter[i]);
    }
  }

  #renderPoint(point) {
    const waypointPresenter = new WaypointPresenter({
      waypointContainer: this.#boardComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleWaypointChange});
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

  #handleWaypointChange = (updatedWaypoint) => {
    this.#humanizedWaypoints = updateItem(this.#humanizedWaypoints, updatedWaypoint);
    this.#sourcedWaypoints = updateItem(this.#humanizedWaypoints, updatedWaypoint);
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  init() {
    this.#humanizedWaypoints = [...this.#waypointModel.humanizedWaypoints];
    this.#sourcedWaypoints = [...this.#waypointModel.humanizedWaypoints];
    this.#setupFilters();
    this.#renderSortings();
    this.#renderContentContainer();
    this.#getCurrentFilterAndWaypoints();

    if(this.#waypointsByCheckedFilter.length < 1){
      this.#renderMessage(this.checkedFilter);
    }else{
      this.#renderPoints();
    }
  }
}
