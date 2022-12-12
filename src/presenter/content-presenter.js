import { render } from '../render.js';
import ContentView from '../view/content-view.js';
import EditView from '../view/edit-view.js';
import LoadingView from '../view/loading-view.js';
import MessageView from '../view/message-view.js';
import WaypointView from '../view/waypoint-view.js';

export default class ContentPresenter {
  boardComponent = new ContentView();

  constructor({contentContainer,waypointModel}){
    this.contentContainer = contentContainer;
    this.waypoinModel = waypointModel;
  }

  init() {
    this.boardWaypoints = [...this.waypoinModel.getWaypoints()];
    render(this.boardComponent,this.contentContainer);
    render(new EditView,this.boardComponent.getElement());
    for(let i = 0; i < this.boardWaypoints.length; i++){
      render(new WaypointView({waypoint: this.boardWaypoints[i]}),this.boardComponent.getElement());
    }
    render(new LoadingView,this.boardComponent.getElement(),'AFTEREND');
    render(new MessageView,this.boardComponent.getElement(),'AFTERBEGIN');
  }
}
