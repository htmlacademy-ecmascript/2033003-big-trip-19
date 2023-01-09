import AbstractView from '../framework/view/abstract-view.js';

function createMessageTemplate(filterMessage) {
  const { message} = filterMessage;
  return `<p class="trip-events__msg">${message}</p>`;
}
export default class MessageView extends AbstractView {
  #message = null;
  constructor(message){
    super();
    this.#message = message;
  }

  get template() {
    return createMessageTemplate(this.#message);
  }
}
