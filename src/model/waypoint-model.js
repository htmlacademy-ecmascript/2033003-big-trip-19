import { createDataDestinations } from '../mocks/mock-destination.js';
import { createDataPoints } from '../mocks/mock-waypoint.js';
import { OFFERS, POINT_TYPES } from '../const.js';
import { nanoid } from 'nanoid';

function createPoint(point, offers, destination, allAvailableOffers){
  return {
    id: nanoid(),
    ...{
      basePrice: point.basePrice,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      destination: destination,
      isFavorite: point.isFavorite,
      offers: offers,
      type: point.type,
      offersByType: allAvailableOffers,
      allTypes: POINT_TYPES
    }
  };
}

export default class WaypointModel {
  #offers = OFFERS;
  #destinations = createDataDestinations();
  #waypoints = Array.from(createDataPoints(this.#destinations));

  sortWaypoints() {
    return this.#waypoints.sort((a, b) => a.dateFrom - b.dateFrom);
  }

  get waypoints() {
    return this.#waypoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get humanizedWaypoints() {
    const cloneWaypoints = [...this.#waypoints];
    const humanizedWaypoints = [];
    for (const point of cloneWaypoints) {
      let allAvailableOffers = [];
      const availableOffers = [];

      point.offers.sort((a, b) => a - b);
      allAvailableOffers = this.#offers.find((offer) => offer.type === point.type);

      for (const pointOffer of point.offers) {
        for (const availableOffer of allAvailableOffers.offers) {
          if (pointOffer === availableOffer.id) {
            availableOffers.push(availableOffer);
            break;
          }
        }
      }

      const destinationdById = this.#destinations.find((destinationElement) => destinationElement.id === point.destination);

      const humanizedPoint = createPoint(point, availableOffers, destinationdById, allAvailableOffers.offers);
      humanizedWaypoints.push(humanizedPoint);
    }
    return humanizedWaypoints.sort((a, b) => a.dateFrom - b.dateFrom);
  }
}
