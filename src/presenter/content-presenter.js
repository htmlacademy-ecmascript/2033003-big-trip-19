import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import MessageView from '../view/message-view.js';
import WaypointView from '../view/waypoint-view.js';
import FilterContainerView from '../view/filter-container-view.js';
import { replace } from '../framework/render.js';
export default class ContentPresenter {
  #boardComponent = new ContentView();
  #filterComponent = null;
  #contentContainer = null;
  #filtersContainer = null;
  #waypoinModel = null;
  #filterModel = null;

  constructor({ contentContainer, filtersContainer, waypointModel, filterModel}) {
    this.#contentContainer = contentContainer;
    this.#filtersContainer = filtersContainer;
    this.#waypoinModel = waypointModel;
    this.#filterModel = filterModel;
  }

  #setupFilters(){
    this.filters = [...this.#filterModel.filters];
    this.#filterComponent = new FilterContainerView({filters: this.filters});
    this.#renderFilters(this.#filterComponent);
  }

  #renderFilters(component){
    render(component, this.#filtersContainer);
  }

  #renderContentContainer(){
    render(this.#boardComponent, this.#contentContainer);
  }

  #renderPoint(point) {
    const pointComponent = new WaypointView({
      waypoint: point,
      onShowEditClick: () => {
        replacePointToEdit.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
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
    this.#setupFilters();
    this.#renderContentContainer();

    this.humanisedWaypoints = [...this.#waypoinModel.humanizedWaypoints];
    if(this.humanisedWaypoints.length < 1){
      const checkedFilterElement = this.#filterComponent.element.querySelector('input[type="radio"]:checked');
      const checkedFilter = this.filters.find((filter) => filter.name === checkedFilterElement.value);
      this.#renderMessage(checkedFilter);
    }else{
      for (let i = 0; i < this.humanisedWaypoints.length; i++) {
        this.#renderPoint(this.humanisedWaypoints[i]);
      }
    }
  }
}
