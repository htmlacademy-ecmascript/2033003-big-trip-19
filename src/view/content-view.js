import {createElement} from '../render.js';

const createContentTemplate = () => '<ul class="trip-events__list"></ul>';
export default class ContentView {
  #element = null;

  get template() {
    return createContentTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
