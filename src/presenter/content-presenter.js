import { render } from '../render.js';
import { replace } from '../framework/render.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import MessageView from '../view/message-view.js';
import WaypointView from '../view/waypoint-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import FilterModel from '../model/filter-model.js';

export default class ContentPresenter {
  #boardComponent = new ContentView();
  #filterComponent = null;
  #contentContainer = null;
  #filtersContainer = null;
  #waypoinModel = null;
  #filterModel = null;
  #humanizedWaypoints = null;
  #checkedFilter = null;
  #waypointsByCheckedFilter = null;

  constructor({ contentContainer, filtersContainer, waypointModel}) {
    this.#contentContainer = contentContainer;
    this.#filtersContainer = filtersContainer;
    this.#waypoinModel = waypointModel;
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
    const pointComponent = new WaypointView({
      waypoint: point,
      onShowEditClick: () => {
        replacePointToEdit.call(this);
      }
    });
    const editPointComponent = new EditPointView({
      waypoint: point,
      onCloseEditClick: () => {
        replaceEditToPoint.call(this);
      },
      onDeleteClick: () => {
        replaceEditToPoint.call(this);
      },
      onSaveClick: () => {
        replaceEditToPoint.call(this);
      }
    });

    function replacePointToEdit () {
      replace(editPointComponent, pointComponent);
      document.addEventListener('keydown', escKeyDownHandler);
    }
    function replaceEditToPoint() {
      replace(pointComponent, editPointComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
    function escKeyDownHandler(evt){
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    }

    render(pointComponent, this.#boardComponent.element);
  }

  #renderMessage(filter){
    const messageComponent = new MessageView({message: filter.message});
    render(messageComponent, this.#contentContainer);
  }

  init() {
    this.#humanizedWaypoints = [...this.#waypoinModel.humanizedWaypoints];

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
