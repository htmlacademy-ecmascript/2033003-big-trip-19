import { remove, render } from '../framework/render.js';
import AddPointView from '../view/add-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  ADDING : 'ADDING'
};

export default class NewPointPresenter{
  #contentContainer = null;
  #newPointComponent = null;
  #newWaypoint = null;
  #handleCancelClick = null;
  #handleSaveClick = null;
  #mode = null;

  constructor({ newWaypointContainer, onCancelClick, onSaveClick}){
    this.#contentContainer = newWaypointContainer;
    this.#handleCancelClick = onCancelClick;
    this.#handleSaveClick = onSaveClick;
  }

  init(newWaypoint, mode){
    const prevNewPointComponent = this.#newPointComponent;
    this.#newWaypoint = newWaypoint;
    this.#mode = mode;
    this.#newPointComponent = new AddPointView({
      waypoint: this.#newWaypoint,
      onCancelAddPointClick: this.cancelAddPointClick,
      onSaveNewPointClick: this.#saveNewPointClick
    });

    if(this.#mode === Mode.ADDING){
      render(this.#newPointComponent, this.#contentContainer,'BEFOREBEGIN');
      return;
    }

    remove(prevNewPointComponent);
  }

  resetView(){
    if (this.#mode !== Mode.DEFAULT){
      this.#newPointComponent.reset(this.#newWaypoint);
    }
  }

  destroy() {
    remove(this.#newPointComponent);
  }

  cancelAddPointClick = () => {
    remove(this.#newPointComponent);
    this.#handleCancelClick();
  };

  #saveNewPointClick = (waypoint) => {
    remove(this.#newPointComponent);
    this.#handleSaveClick(waypoint);
  };
}
