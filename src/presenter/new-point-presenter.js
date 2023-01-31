import { UpdateType, UserAction } from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import AddPointView from '../view/add-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  ADDING : 'ADDING'
};

export default class NewPointPresenter{
  #contentContainer = null;
  #newPointComponent = null;
  #newWaypoint = null;
  #handleDataChange = null;
  mode = null;
  #handleDestroy = null;

  constructor({ newWaypointContainer, onDataChange, onDestroy}){
    this.#contentContainer = newWaypointContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(newWaypoint){
    if (this.#newPointComponent !== null) {
      return;
    }

    this.#newWaypoint = newWaypoint;

    this.#newPointComponent = new AddPointView({
      waypoint: this.#newWaypoint,
      onCancelAddPointClick: this.cancelAddPointClick,
      onSaveNewPointClick: this.#saveNewPointClick
    });

    render(this.#newPointComponent, this.#contentContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#newPointComponent);
    this.#newPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView(){
    if (this.mode !== Mode.DEFAULT){
      document.removeEventListener('keydown', this.#escKeyDownHandler);
      remove(this.#newPointComponent);
      this.mode = Mode.DEFAULT;
    }
  }

  cancelAddPointClick = () => {
      this.destroy();
  };

  #saveNewPointClick = (waypoint) => {
    this.destroy();
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
