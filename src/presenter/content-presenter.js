import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';
export default class ContentPresenter {
  #boardComponent = new ContentView();

  constructor({contentContainer,waypointModel,destinationModel}){
    this.contentContainer = contentContainer;
    this.waypoinModel = waypointModel;
    this.destinationModel = destinationModel;
  }

  #renderPoint(point, randomeDestination, allDestinations){
    const pointComponent = new WaypointView({waypoint: point, allDestinations: allDestinations});
    const editPointComponent = new EditPointView({destination: randomeDestination});

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
    this.allDestinations = this.destinationModel.destinations;
    this.boardWaypoints = this.waypoinModel.sortWaypoints([...this.waypoinModel.waypoints]);
    this.randomeDestination = this.destinationModel.getRandomeDestination();

    render(this.#boardComponent,this.contentContainer);

    for(let i = 0; i < this.boardWaypoints.length; i++){
      this.#renderPoint(this.boardWaypoints[i],this.randomeDestination,this.allDestinations);
    }
  }
}
