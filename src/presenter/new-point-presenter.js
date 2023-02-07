import { UpdateType, UserAction, ViewMode} from '../const.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';

export default class NewPointPresenter{
  #contentContainer = null;
  #newPointComponent = null;
  #newWaypoint = null;
  #handleDataChange = null;
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

    this.#newPointComponent = new EditPointView({
      waypoint: this.#newWaypoint,
      onCancelClick: this.#cancelAddPointClick,
      onSaveClick: this.#saveNewPointClick,
      mode: ViewMode.ADDING
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

  setSaving() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointComponent.shake(resetFormState);
  }

  #cancelAddPointClick = () => {
    this.destroy();
  };

  #saveNewPointClick = (waypoint) => {
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
