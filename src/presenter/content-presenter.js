import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import MessageView from '../view/message-view.js';
import WaypointView from '../view/waypoint-view.js';
import FilterContainerView from '../view/filter-container-view.js';
export default class ContentPresenter {
  #boardComponent = new ContentView();
  #filterComponent = null;
  constructor({ contentContainer, filtersContainer, waypointModel, filterModel}) {
    this.contentContainer = contentContainer;
    this.filtersContainer = filtersContainer;
    this.waypoinModel = waypointModel;
    this.filterModel = filterModel;
  }

  #renderFilters(filters){
    const filterComponent = new FilterContainerView({filters: filters});
    render(filterComponent, this.filtersContainer);
  }

  #renderPoint(point) {
    const pointComponent = new WaypointView({ waypoint: point });
    const editPointComponent = new EditPointView({ waypoint: point });

    const replaceEditToPoint = () => {
      this.#boardComponent.element.replaceChild(pointComponent.element, editPointComponent.element);
    };

    const replacePointToEdit = () => {
      this.#boardComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint(pointComponent.element, editPointComponent.element);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointToEdit();
      document.addEventListener('keydown', escKeyDownHandler);
    });
    editPointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });
    editPointComponent.element.querySelector('form').addEventListener('reset', () => {
    });
    editPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceEditToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    });
    render(pointComponent, this.#boardComponent.element);
  }

  #renderMessage(filter){
    const messageComponent = new MessageView({message: filter.message});
    render(messageComponent,this.contentContainer);
  }

  init() {
    this.filters = [...this.filterModel.filters];
    this.#filterComponent = new FilterContainerView({filters: this.filters});
    this.#renderFilters(this.filters);

    this.humanisedWaypoints = [...this.waypoinModel.humanizedWaypoints];
    render(this.#boardComponent, this.contentContainer);

    if(this.humanisedWaypoints.length < 1){
      const checkedFilterElement = this.#filterComponent.element.querySelector('input[type="radio"]:checked');
      const checkedFilter = this.filters.find((filter) => filter.name === checkedFilterElement.value);
      this.#renderMessage(checkedFilter);
    }
    for (let i = 0; i < this.humanisedWaypoints.length; i++) {
      this.#renderPoint(this.humanisedWaypoints[i]);
    }
  }
}
