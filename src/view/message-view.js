import {createElement} from '../render.js';

function createMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}
export default class MessageView {
  #element = null;
  #message = null;
  constructor(message){
    this.#message = message;
  }

  get template() {
    return createMessageTemplate(this.#message);
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
