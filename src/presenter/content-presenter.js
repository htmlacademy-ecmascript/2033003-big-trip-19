import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import MessageView from '../view/message-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import FilterModel from '../model/filter-model.js';
import WaypointPresenter from './waypoint-presenter.js';
import WaypointModel from '../model/waypoint-model.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #filterComponent = null;
  #contentContainer = null;
  #filtersContainer = null;
  #filterModel = null;
  #humanizedWaypoints = null;
  #checkedFilter = null;
  #waypointsByCheckedFilter = null;
  #waypointPresenters = new Map();
  #waypointModel = new WaypointModel();

  constructor({ contentContainer, filtersContainer}) {
    this.#contentContainer = contentContainer;
    this.#filtersContainer = filtersContainer;
  }

  #setupFilters(){
    this.#filterModel = new FilterModel({waypoints: this.#humanizedWaypoints});
    this.filters = [...this.#filterModel.humanizedFilters];
    this.#filterComponent = new FilterContainerView({
      filters: this.filters
    });
    this.#renderFilters(this.#filterComponent);
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
    const waypointPresenter = new WaypointPresenter({waypointContainer: this.#boardComponent.element, onModeChange: this.#handleModeChange});
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

  init() {
    this.#humanizedWaypoints = [...this.#waypointModel.humanizedWaypoints];

    this.#setupFilters();
    this.#renderContentContainer();
    this.#getCurrentFilterAndWaypoints();

    if(this.#waypointsByCheckedFilter.length < 1){
      this.#renderMessage(this.checkedFilter);
    }else{
      this.#renderPoints();
    }
  }
}
