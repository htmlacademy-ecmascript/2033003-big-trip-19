import { UpdateType, UserAction, ViewMode } from '../const.js';
import { remove, render, replace } from '../framework/render.js';
import EditPointView from '../view/edit-point-view';
import WaypointView from '../view/waypoint-view.js';

export default class WaypointPresenter{
  #contentContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #newWaypointPresenter = null;
  #waypoint = null;
  #mode = ViewMode.DEFAULT;
  #handleModeChange = null;
  #handleDataChange = null;

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
      onDeleteClick: this.#handleDeleteClick,
      onSaveClick: this.#handleFormSubmit,
    });

    if(prevPointComponent === null || prevEditPointComponent === null){
      render(this.#pointComponent, this.#contentContainer);
      return;
    }
    if (this.#mode === ViewMode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === ViewMode.EDITING) {
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
    if (this.#mode !== ViewMode.DEFAULT){
      this.#editPointComponent.reset(this.#waypoint);
      this.#replaceEditToPoint();
    }
  }

  setSaving() {
    if (this.#mode === ViewMode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === ViewMode.EDITING) {
      this.#editPointComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === ViewMode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  }

  #replacePointToEdit () {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = ViewMode.EDITING;
    this.#newWaypointPresenter.destroy();
  }

  #replaceEditToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = ViewMode.DEFAULT;
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

  #handleDeleteClick = (waypoint) => {
    this.#handleDataChange(
      UserAction.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      waypoint
    );
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      {...this.#waypoint, isFavorite: !this.#waypoint.isFavorite}
    );
  };
}

