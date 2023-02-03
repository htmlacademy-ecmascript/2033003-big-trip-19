import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { isEmptyObject } from '../utils/util-waypoint.js';
import { lowwerCaseFirst, upperCaseFirst } from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { isCheckedOffer } from '../utils/util-waypoint.js';

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
            <label class="event__offer-label" for="event-offer-${lowwerCaseFirst(offer.title)}-${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
    </div>`).join('')}
    </div>
  </section>`;

const createAddPointViewTemplate = (waypoint) => {
  const {basePrice, destination, type, allTypes, allDestinationNames, offersByType, isDisabled, isSaving} = waypoint;
  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox"}>

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
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="" required>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="" required>
  </div>

  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-1">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" pattern="[0-9]+" value="${basePrice}" required>
  </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
      ${isSaving ? 'Saving...' : 'Save'}
      </button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersByType.length > 0 ? createOffersViewTemplate(waypoint, offersByType) : ''}
      ${!isEmptyObject(destination) ? createDestinationViewTemplate(destination) : ''}
    </section>
  </form>
</li>`;
};

export default class AddPointView extends AbstractStatefulView {
  #handleCancelAddPointClick = null;
  #handleSaveNewPointClick = null;
  #datepickerStartWaypoint = null;
  #datepickerEndWaypoint = null;
  #destinationNames = null;
  #startDatePickerElement = null;
  #endDatePickerElement = null;

  constructor({ waypoint, onCancelAddPointClick, onSaveNewPointClick}) {
    super();
    this._setState(AddPointView.parseWaypointToState(waypoint));
    this.#handleCancelAddPointClick = onCancelAddPointClick;
    this.#handleSaveNewPointClick = onSaveNewPointClick;
    this.#destinationNames = waypoint.allDestinationNames;

    this._restoreHandlers();
  }

  get template() {
    return createAddPointViewTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('reset', this.#closeClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#saveNewPointClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChange);

    const types = this.element.querySelectorAll('.event__type-input');
    for (const type of types){
      type.addEventListener('click', this.#typeChangeHandler);
    }

    const destination = this.element.querySelector('.event__input--destination');
    const destinationName = destination.value;
    destination.addEventListener('change', (evt) => this.#destinationChangeHandler(evt, destinationName));

    this.#setOfferClickHandler();

    this.#startDatePickerElement = this.element.querySelector('input[name="event-start-time"]');
    this.#endDatePickerElement = this.element.querySelector('input[name="event-end-time"]');
    this.#setDatepickers();
  }

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

  #setOfferClickHandler(){
    const offers = this.element.querySelectorAll('.event__offer-checkbox');
    for (const offer of offers){
      offer.addEventListener('click', this.#offerClickHandler);
    }
  }

  #setDatepickers() {
    this.#datepickerStartWaypoint = flatpickr(
      this.#startDatePickerElement,
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateStartChangeHandler,
      },
    );
    this.#datepickerEndWaypoint = flatpickr(
      this.#endDatePickerElement,
      {
        dateFormat: 'd/m/Y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        onChange: this.#dateEndChangeHandler,
        disable: [
          (date) => date < this.#datepickerStartWaypoint.selectedDates[0]
        ]
      },
    );
  }

  #priceChange = (evt) => {
    const price = Number(evt.target.value);
    if(!isNaN(price) && price > 0){
      this.updateElement({
        basePrice: Number(evt.target.value)
      });
    }else{
      evt.target.setCustomValidity('Значение должно быть больше 0');
    }
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    const datasetOffer = Number(evt.currentTarget.dataset.offer);

    let offer;
    const offersByType = this._state.allOffers.find((element) => element.type === this._state.type);
    if (offersByType) {
      offer = offersByType.offers.find((element) => element.id === datasetOffer);
    }

    if(!evt.target.checked){
      this._state.offers = this._state.offers.filter((element) => element.id !== datasetOffer);
    }else{
      this._state.offers.push(offer);
    }

    this.updateElement({offers: this._state.offers});
  };

  #dateStartChangeHandler = (userDate) => {
    if (this.#datepickerStartWaypoint.selectedDates[0] > this.#datepickerEndWaypoint.selectedDates[0]) {
      this.#datepickerEndWaypoint.clear();
    }
    this.updateElement({dateFrom: userDate[0]});
  };

  #dateEndChangeHandler = (userDate) => {
    this.updateElement({dateTo: userDate[0]});
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const offersByType = this._state.allOffers.find((offer) => offer.type === evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offersByType: offersByType.offers,
      offers: []
    });
  };

  #destinationChangeHandler = (evt, prevDestinationName) => {
    let destination = null;
    if(this.#destinationNames.includes(evt.target.value)) {
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
    let isValid = true;
    if (!this.#startDatePickerElement.value) {
      isValid = false;
    }

    if (!this.#endDatePickerElement.value) {
      isValid = false;
    }

    if (this._state.basePrice <= 0) {
      isValid = false;
    }

    evt.preventDefault();
    if (isValid) {
      this.#handleSaveNewPointClick(AddPointView.parseStateToWaypoint(this._state));
    }
  };

  static parseWaypointToState(waypoint) {
    return {
      ...waypoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToWaypoint(state) {
    const waypoint = {...state};

    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;

    return waypoint;
  }
}
