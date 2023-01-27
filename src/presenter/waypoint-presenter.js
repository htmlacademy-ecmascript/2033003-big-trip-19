import { remove, render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING : 'ADDING'
};
export default class WaypointPresenter{
  #contentContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #waypoint = null;
  #mode = Mode.DEFAULT;
  #handleModeChange = null;
  #handleDataChange = null;
  #newWaypointPresenter = null;

  constructor({newWaypointPresenter, waypointContainer, onModeChange, onDataChange}){
    this.#newWaypointPresenter = newWaypointPresenter;
    this.#contentContainer = waypointContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
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
      this.#editPointComponent.reset(this.#waypoint);
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit () {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
    this.#newWaypointPresenter.forEach((presenter) => presenter.cancelAddPointClick());
  }

  #replaceEditToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleShowEditClick = () => {
    this.#replacePointToEdit();
  };

  #handleCloseEditClick = () => {
    this.resetView();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#waypoint, isFavorite: !this.#waypoint.isFavorite});
  };

}

