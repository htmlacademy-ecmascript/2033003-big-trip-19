import { createDataDestinations } from '../mocks/mock-destination.js';
import { createDataPoints } from '../mocks/mock-waypoint.js';
import { DESTINATION_NAMES, OFFERS, POINT_TYPES } from '../const.js';
import { nanoid } from 'nanoid';
import { sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice } from '../utils/util-waypoint.js';

function createPoint(point, offers, destination, allAvailableOffers, alldestinations, allTypes, destinationNames){
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
      allTypes: allTypes,
      allDestinationNames: destinationNames,
      allDestinations: alldestinations
    }
  };
}

export default class WaypointModel {
  #offers = OFFERS;
  #destinationNames = DESTINATION_NAMES;
  #destinations = createDataDestinations(this.#destinationNames.length);
  #waypoints = Array.from(createDataPoints(this.#destinations));
  #humanizedWaypoints = null;
  #allTypes = POINT_TYPES;

  get waypoints() {
    return this.#waypoints;
  }

  get allTypes() {
    return this.#allTypes;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers(){
    return this.#offers;
  }

  get humanizedWaypoints() {
    const cloneWaypoints = [...this.#waypoints];
    this.#humanizedWaypoints = [];
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

      const humanizedPoint = createPoint(point, availableOffers, destinationdById, allAvailableOffers.offers, this.#destinations, this.#allTypes, this.#destinationNames);
      this.#humanizedWaypoints.push(humanizedPoint);
    }
    return this.#humanizedWaypoints.sort(sortWaypointByDate);
  }

  sortWaypoints(waypoints, sortType){
    switch(sortType){
      case sortType = 'day':
        waypoints.sort(sortWaypointByDate);
        break;
      case sortType = 'time':
        waypoints.sort(sortWaypointByDuration);
        break;
      case sortType = 'price':
        waypoints.sort(sortWaypointByPrice);
        break;
      default:
        waypoints.sort(sortWaypointByDate);
    }
    return waypoints;
  }
}
