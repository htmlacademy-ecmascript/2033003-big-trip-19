import AbstractView from '../framework/view/abstract-view.js';

function createTripInfoTemplate(trip) {
  const {template, dates, cost} = trip;
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${template}</h1>

    <p class="trip-info__dates">${dates}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
}

export default class TripInfoView extends AbstractView {
  #trip = null;

  constructor({trip}){
    super();
    this.#trip = trip;
  }

  get template() {
    return createTripInfoTemplate(this.#trip);
  }
}
