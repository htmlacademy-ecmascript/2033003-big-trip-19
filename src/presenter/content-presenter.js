import { render } from '../render.js';
import AddPointView from '../view/add-point-view.js';
import ContentView from '../view/content-view.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';
export default class ContentPresenter {
  boardComponent = new ContentView();
  constructor({contentContainer,waypointModel,destinationModel}){
    this.contentContainer = contentContainer;
    this.waypoinModel = waypointModel;
    this.destinationModel = destinationModel;
  }

  init() {
    this.allDestinations = this.destinationModel.getDestinations();
    this.boardWaypoints = this.waypoinModel.sortWaypoints([...this.waypoinModel.getWaypoints()]);
    this.randomeDestination = this.destinationModel.getRandomeDestination();

    render(new AddPointView({destination: this.randomeDestination}),this.boardComponent.getElement());
    this.randomeDestination = this.destinationModel.getRandomeDestination();
    render(new EditPointView({destination: this.randomeDestination}),this.boardComponent.getElement());
    render(this.boardComponent,this.contentContainer);
    for(let i = 0; i < this.boardWaypoints.length; i++){
      this.randomeDestination = this.destinationModel.getRandomeDestination();
      render(new WaypointView({waypoint: this.boardWaypoints[i], destination: this.randomeDestination, allDestinations: this.allDestinations}),this.boardComponent.getElement());
    }
  }
}
