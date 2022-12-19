import {createElement} from '../render.js';

function createMessageTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}
export default class MessageView {
  #message = '';
  constructor(){
    this.#message = 'Click New Event to create your first point';
  }

  getTemplate() {
    return createMessageTemplate(this.#message);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
