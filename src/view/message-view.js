import AbstractView from '../framework/view/abstract-view.js';
import { NoWaypointsTextType } from '../utils/util-waypoint.js';

const createMessageTemplate = (filterType) => {
  const noWaypointTextValue = NoWaypointsTextType[filterType];
  return `<p class="trip-events__msg">${noWaypointTextValue}</p>`;
};

export default class MessageView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createMessageTemplate(this.#filterType);
  }
}
