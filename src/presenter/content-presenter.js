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

  #setupSortings(){
    render(new SortContainerView({sortings: SortType}),this.#sortingsContainer);
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
    this.#waypointPresenters.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  init() {
    this.#humanizedWaypoints = [...this.#waypointModel.humanizedWaypoints];

    this.#setupFilters();
    this.#setupSortings();
    this.#renderContentContainer();
    this.#getCurrentFilterAndWaypoints();



    if(this.#waypointsByCheckedFilter.length < 1){
      this.#renderMessage(this.checkedFilter);
    }else{
      this.#renderPoints();
    }
  }
}
