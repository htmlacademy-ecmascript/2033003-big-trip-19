import AbstractView from '../framework/view/abstract-view.js';
import { getTimeFromDate } from '../utils/util-waypoint.js';
import { upperCaseFirst } from '../utils/common.js';
import { getDateDifference, humanizeWaypointDate } from '../utils/util-waypoint.js';

const createWaypointTemplate = (waypoint) => {
  const {type,destination,dateFrom,dateTo,basePrice,offers} = waypoint;
  return (`<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dateFrom}">${humanizeWaypointDate(dateFrom)}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${upperCaseFirst(type)} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dateFrom}">${getTimeFromDate(dateFrom)}</time>
        &mdash;
        <time class="event__end-time" datetime="${dateTo}">${getTimeFromDate(dateTo)}</time>
      </p>
      <p class="event__duration">${getDateDifference(dateFrom,dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer) => `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
    </li>`).join('')}
    </ul>
    <button class="event__favorite-btn event__favorite-btn${waypoint.isFavorite ? '--active' : ''}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`);
};

export default class WaypointView extends AbstractView {
  #waypoint = null;
  #handleShowEditClick = null;
  #handleFavoriteClick = null;
  constructor({ waypoint, onShowEditClick, onFavoriteClick}) {
    super();
    this.#waypoint = waypoint;
    this.#handleShowEditClick = onShowEditClick;
    this.#handleFavoriteClick = onFavoriteClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#waypoint);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleShowEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
