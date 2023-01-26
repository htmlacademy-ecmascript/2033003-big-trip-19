import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { isEmptyObject } from '../utils/util-waypoint.js';
import { lowwerCaseFirst, upperCaseFirst } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { DESTINATION_NAMES } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  ADDING : 'ADDING'
};

const createDestinationViewTemplate = (destinationPoint) => {
  const { description, pictures } = destinationPoint;
  return `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description}</p>
  <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
                      </div>
                    </div>
  </section>`;
};

const isCheckedOffer = (offer, pointOffers) => {
  let status = false;
  for (let i = 0; i < pointOffers.length; i++) {
    const pointOffer = pointOffers[i];
    if(pointOffer.id === offer.id){
      status = pointOffer.isChecked;
    }
  }
  return status;
};

const showDestinationTitle = (destination) => `<input class="event__input  event__input--destination" id="event-destination-${destination.id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${destination.id}">`;

const showDestinationsList = (destination, type, allDestinationNames) => `<div class="event__field-group  event__field-group--destination">
<label class="event__label  event__type-output" for="event-destination-${destination.id}">
${upperCaseFirst(type)}
</label>
${showDestinationTitle(destination)}
<datalist id="destination-list-${destination.id}">
  ${allDestinationNames.map((name) => `<option value="${name}" ${name === destination.name ? 'selected' : ''}></option>`).join('')}
</datalist>
</div>`;

const createOffersViewTemplate = (waypoint, offers) => `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" data-offer="${offer.id}" id="event-offer-${lowwerCaseFirst(offer.title)}-${offer.id}" type="checkbox" name="event-offer-${lowwerCaseFirst(offer.title)}" ${isCheckedOffer(offer, waypoint.offers) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${lowwerCaseFirst(offer.title.split(' ')[0])}-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
    </div>`).join('')}
    </div>
  </section>`;

const createAddPointViewTemplate = (waypoint) => {
  const {id, basePrice, destination, type, allTypes, allDestinationNames, allOffers} = waypoint;
  const offersByType = allOffers.find((offer) => offer.type === type);
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox"}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${allTypes.map((pointType, index) => `<div class="event__type-item">
            <input id="event-type-${pointType}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${type === pointType ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${index}">${upperCaseFirst(pointType)}</label>
            </div>`).join('')}
          </fieldset>
        </div>
      </div>
    ${!isEmptyObject(destination) ? showDestinationsList(destination, type, allDestinationNames) : ''}
    <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="">
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="">
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" pattern="[0-9]+" value="${basePrice}">
  </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersByType.offers.length > 0 ? createOffersViewTemplate(waypoint, offersByType.offers) : ''}
      ${!isEmptyObject(destination) ? createDestinationViewTemplate(destination) : ''}
    </section>
  </form>
</li>`;
};

export default class AddPointView extends AbstractStatefulView {
  #handleCancelAddPointClick = null;
  #handleSaveNewPointClick = null;
  #handleAddPointClick = null;
  #datepickerStartWaypoint = null;
  #datepickerEndWaypoint = null;
  #mode = Mode.DEFAULT;
  #addButton = null;

  constructor({ waypoint, mode, onCancelAddPointClick, onSaveNewPointClick, onAddPointClick}) {
    super();
    this._setState(AddPointView.parseWaypointToState(waypoint));
    this.#mode = mode;
    this.#handleCancelAddPointClick = onCancelAddPointClick;
    this.#handleSaveNewPointClick = onSaveNewPointClick;
    this.#handleAddPointClick = onAddPointClick;

    this.#addButton = document.querySelector('.trip-main__event-add-btn');
    this.#addButton.addEventListener('click', this.#addPointClickHandler);

    this._restoreHandlers();
  }

  static parseWaypointToState(waypoint) {
    return {...waypoint};
  }

  static parseStateToWaypoint(state) {
    const waypoint = {...state};

    return waypoint;
  }

  #updateButtonState = () =>{
    if(this.#mode === Mode.DEFAULT){
      this.#addButton.disabled = false;
    }else{
      this.#addButton.disabled = true;
      this.#addButton.removeEventListener('click', this.#addPointClickHandler);
    }
  };

  #priceChange = (evt) => {
    const price = Number(evt.target.value);
    if(!isNaN(price)){
      this.updateElement({
        basePrice: Number(evt.target.value)
      });
    }
  };

  #setDatepickers() {
    this.#datepickerStartWaypoint = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateStartChangeHandler,
      },
    );
    this.#datepickerEndWaypoint = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateEndChangeHandler,
      },
    );
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offersByType: this._state.allOffers.find((offer) => offer.type === evt.target.value),
      offers: []
    });
  };

  #destinationChangeHandler = (evt, prevDestinationName) => {
    let destination = null;
    if(DESTINATION_NAMES.includes(evt.target.value)) {
      destination = this._state.allDestinations.filter((element) => element.name === evt.target.value);
    }else{
      destination = this._state.allDestinations.filter((element) => element.name === prevDestinationName);
    }
    this.updateElement({
      destination: destination[0],
      offers: []
    });
  };

  #closeClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleCancelAddPointClick();
  };

  #saveNewPointClickHandler = (evt) =>{
    evt.preventDefault();
    this.#handleSaveNewPointClick(AddPointView.parseStateToWaypoint(this._state));
  };

  #addPointClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAddPointClick();
  };

  #dateStartChangeHandler = (userDate) => {
    this.updateElement({dateFrom: userDate[0]});
  };

  #dateEndChangeHandler = (userDate) => {
    this.updateElement({dateTo: userDate[0]});
  };

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('reset', this.#closeClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#saveNewPointClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChange);

    const types = this.element.querySelectorAll('.event__type-input');
    for (let i = 0; i < types.length; i++){
      types[i].addEventListener('click', this.#typeChangeHandler);
    }

    const destination = this.element.querySelector('.event__input--destination');
    const destinationName = destination.value;
    destination.addEventListener('change', (evt) => this.#destinationChangeHandler(evt, destinationName));

    const offers = this.element.querySelectorAll('.event__offer-checkbox');
    for (let i = 0; i < offers.length; i++){
      offers[i].addEventListener('click', this.#setOfferClickHandler);
    }

    this.#updateButtonState();
    this.#setDatepickers();
  }

  #setOfferClickHandler = (evt) => {
    evt.preventDefault();
    const offer = Number(evt.currentTarget.dataset.offer);
    if(!evt.target.checked){
      this._state.offers.forEach((item, i) => {
        if (item.offer === offer) {
          this._state.offers.splice(i, 1);
        }
      });
    }else{
      this._state.offers.push({isChecked: evt.target.checked,...{offer}});
    }

    this.updateElement({offers: this._state.offers});
  };

  removeElement(){
    super.removeElement();
    if(this.#datepickerStartWaypoint){
      this.#datepickerStartWaypoint.destroy();
      this.#datepickerStartWaypoint = null;
    }
    if(this.#datepickerEndWaypoint){
      this.#datepickerEndWaypoint.destroy();
      this.#datepickerEndWaypoint = null;
    }
  }

  get template() {
    return createAddPointViewTemplate(this._state, this.#mode);
  }
}
