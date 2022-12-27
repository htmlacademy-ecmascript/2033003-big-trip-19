import { createDataDestinations } from '../mock-destination.js';
import { createDataPoints} from '../mock-waypoint.js';
import { OFFERS, POINT_TYPES } from '../const.js';

const getUniqArrayElements = (array) => {
  const newSet = new Set(array);
  return Array.from(newSet);
};
const createPoint = (point, offers, destination, allAvailableOffers, pointTypes) =>({
  basePrice: point.basePrice,
  dateFrom: point.dateFrom,
  dateTo: point.dateTo,
  destination: destination,
  id: point.id,
  isFavorite: point.isFavorite,
  offers: offers,
  type: point.type,
  offersByType: allAvailableOffers,
  pointTypes: pointTypes
});
export default class WaypointModel{
  #offers = OFFERS;
  #destinations = createDataDestinations();
  #waypoints = Array.from(createDataPoints(this.#destinations));
  #pointTypes = POINT_TYPES;

  sortWaypoints(){
    return this.#waypoints.sort((a, b) => a.dateFrom - b.dateFrom);
  }

  get waypoints(){
    return this.#waypoints;
  }

  get destinations(){
    return this.#destinations;
  }

  get humanizedWaypoints(){
    const cloneWaypoints = [...this.#waypoints];
    const humanizedWaypoints = [];

    for(let i = 0; i < cloneWaypoints.length; i++) {
      const point = cloneWaypoints[i];
      let allAvailableOffers = [];
      const availableOffers = [];
      point.offers.sort((a, b) => a - b);

      allAvailableOffers = this.#offers.find((offer) => offer.type === point.type);
      for(let k = 0; k < point.offers.length; k++){
        for(let j = 0; j < allAvailableOffers.offers.length; j++){
          if(point.offers[k] === allAvailableOffers.offers[j].id){
            availableOffers.push(allAvailableOffers.offers[j]);
            break;
          }
        }
      }
      const destinationdById = this.#destinations.find((destinationElement) => destinationElement.id === point.destination);
      const humanizedPoint = createPoint(point, availableOffers, destinationdById, allAvailableOffers.offers, this.#pointTypes);
      humanizedWaypoints.push(humanizedPoint);
    }
    return humanizedWaypoints;
  }

}
