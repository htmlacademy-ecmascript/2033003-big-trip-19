import { nanoid } from 'nanoid';
import { UpdateType, UserAction } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
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
  #handleAddPointClick = null;
  #handleDataChange = null;
  mode = null;

  constructor({ newWaypointContainer, onCancelClick, onAddPointClick, onDataChange}){
    this.#contentContainer = newWaypointContainer;
    this.#handleCancelClick = onCancelClick;
    this.#handleAddPointClick = onAddPointClick;
    this.#handleDataChange = onDataChange;
  }

  init(newWaypoint, mode){
    const prevNewPointComponent = this.#newPointComponent;
    this.#newWaypoint = newWaypoint;
    this.mode = mode;

    this.#newPointComponent = new AddPointView({
      waypoint: this.#newWaypoint,
      mode: this.mode,
      onCancelAddPointClick: this.cancelAddPointClick,
      onSaveNewPointClick: this.#saveNewPointClick,
      onAddPointClick : this.#addPointClick
    });

    if(prevNewPointComponent !== null && this.mode === Mode.ADDING){
      render(this.#newPointComponent, this.#contentContainer,'BEFOREBEGIN');
      return;
    }

    remove(prevNewPointComponent);
  }

  resetView(){
    if (this.mode !== Mode.DEFAULT){
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      remove(this.#newPointComponent);
      this.mode = Mode.DEFAULT;
    }
  }

  cancelAddPointClick = () => {
    if(this.mode === Mode.ADDING){
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      remove(this.#newPointComponent);
      this.#handleCancelClick();
    }
  };

  #saveNewPointClick = (waypoint) => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#newPointComponent);
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #addPointClick = () =>{
    this.#handleAddPointClick();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      if(this.mode === Mode.ADDING){
        document.removeEventListener('keydown', this.#escKeyDownHandler);
        remove(this.#newPointComponent);
        this.#handleCancelClick();
      }
    }
  };
}
