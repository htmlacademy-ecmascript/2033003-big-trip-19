import { POINT_TYPES } from '../const.js';
import {createElement} from '../render.js';
import {isEmptyObject, lowwerCaseFirst, upperCaseFirst } from '../util.js';

const createDestinationWithOffersViewTemplate = (destinationPoint) => {
  const {description} = destinationPoint;
  return`<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  </section>`;
};
const createDestinationWithoutOffersViewTemplate = (destinationPoint) => {
  const {description, pictures} = destinationPoint;
  return`<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${pictures.map((picture) =>`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
                      </div>
                    </div>
  </section>`;
};

const showDestinationTitle = (title, id) => `<input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${title}" list="destination-list-${id}">`;

const getStatus = (offer, point) => {
  let status = '';
  for(let i = 0; i < point.offers.length; i++){
    const pointOffers = point.offers[i];
    if(pointOffers.id === offer.id){
      status = 'checked';
      break;
    }
  }
  return status;
};
const createOffersViewTemplate = (point, allOffers) =>{
  const availableOffers = allOffers.find((offer) => offer.type === point.type);
  return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${availableOffers.offers.map((offer) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${lowwerCaseFirst(offer.title.split(' ')[0])}" type="checkbox" name="event-offer-${lowwerCaseFirst(offer.title.split(' ')[0])}" ${getStatus(offer, point)}>
            <label class="event__offer-label" for="event-offer-${lowwerCaseFirst(offer.title.split(' ')[0])}-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
    </div>`).join('')}
    </div>
  </section>`;
};

function createEditViewTemplate(waypoint, allPointTypes, allOffers) {
  const { type, destination, basePrice, offers } = waypoint;
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${waypoint.id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${waypoint.id}" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${allPointTypes.map((pointType, index) => `<div class="event__type-item">
            <input id="event-type-${pointType}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
            <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${index}">${upperCaseFirst(pointType)}</label>
            </div>`).join('')}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${destination.id}">
        ${upperCaseFirst(type)}
        </label>
        ${!isEmptyObject(destination) ? showDestinationTitle(destination.name, destination.id) : ''}
        <datalist id="destination-list-${destination.id}">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${waypoint.id}">From</label>
        <input class="event__input  event__input--time" id="event-start-time-${waypoint.id}" type="text" name="event-start-time" value="18/03/19 12:25">
        &mdash;
        <label class="visually-hidden" for="event-end-time-${waypoint.id}">To</label>
        <input class="event__input  event__input--time" id="event-end-time-${waypoint.id}" type="text" name="event-end-time" value="18/03/19 13:35">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${waypoint.id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${waypoint.id}" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offers.length > 0 ? createOffersViewTemplate(waypoint, allOffers) : createDestinationWithoutOffersViewTemplate(destination)}
      ${!isEmptyObject(destination) && offers.length > 0 ? createDestinationWithOffersViewTemplate(destination) : ''}
    </section>
  </form>
</li>`;
}

export default class EditPointView {
  #element = null;
  #waypoint = null;
  #allOffers = null;
  #allpointTypes = POINT_TYPES;
  constructor({waypoint, allOffers}) {
    this.#waypoint = waypoint;
    this.#allOffers = allOffers;
  }

  get template() {
    return createEditViewTemplate(this.#waypoint, this.#allpointTypes, this.#allOffers);
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

