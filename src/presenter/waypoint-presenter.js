import { remove, render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};
export default class WaypointPresenter{
  #contentContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #waypoint = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;

  constructor({waypointContainer, onModeChange}){
    this.#contentContainer = waypointContainer;
    this.#handleModeChange = onModeChange;
  }

  init(waypoint){
    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;
    this.#waypoint = waypoint;
    this.#pointComponent = new WaypointView({
      waypoint: this.#waypoint,
      onShowEditClick: this.#handleShowEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });
    this.#editPointComponent = new EditPointView({
      waypoint: this.#waypoint,
      onCloseEditClick: this.#handleCloseEditClick,
      onDeleteClick: this.#handleCloseEditClick,
      onSaveClick: this.#handleCloseEditClick
    });

    if(prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#contentContainer);
      return;
    }
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }
    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView(){
    if (this.#mode !== Mode.DEFAULT){
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit () {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    //this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceEditToPoint();
    }
  };

  #handleShowEditClick = () => {
    this.#replacePointToEdit();
  };

  #handleCloseEditClick = () => {
    this.#replaceEditToPoint();
  };

  #handleFavoriteClick = () => {
    if(this.#waypoint.isFavorite){
      this.#waypoint.isFavorite = false;
    }else{
      this.#waypoint.isFavorite = true;
    }
    this.init(this.#waypoint);
  };
}

