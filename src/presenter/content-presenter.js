import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';
export default class ContentPresenter {
  #boardComponent = new ContentView();

  constructor({contentContainer,waypointModel}){
    this.contentContainer = contentContainer;
    this.waypoinModel = waypointModel;
  }

  #renderPoint(point, allOffers, pointTypes){
    const pointComponent = new WaypointView({waypoint: point});
    const editPointComponent = new EditPointView({waypoint: point, allOffers: allOffers, allPointTypes: pointTypes});

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
    render(pointComponent,this.#boardComponent.element);
  }

  init() {
    this.offers = [...this.waypoinModel.offers];
    this.humanisedWaypoints = [...this.waypoinModel.humanizedWaypoints];
    this.pointTypes = [...this.waypoinModel.pointTypes];
    render(this.#boardComponent,this.contentContainer);

    for(let i = 0; i < this.humanisedWaypoints.length; i++){
      this.#renderPoint(this.humanisedWaypoints[i], this.offers, this.pointTypes);
    }
  }
}
