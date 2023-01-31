import AbstractView from "../framework/view/abstract-view";

export default class NewWaypointButtonView extends AbstractView {
    #handleClick = null;
    addButton = null;

    constructor({ onClick}) {
        super();
        this.#handleClick = onClick;
        this.addButton = document.querySelector('.trip-main__event-add-btn');
        this.addButton.addEventListener('click', this.#addPointClickHandler);
    }

    #addPointClickHandler = (evt) => {
        evt.preventDefault();
        this.#handleClick();
    };

    removeElement() {
      super.removeElement();
    }
}
