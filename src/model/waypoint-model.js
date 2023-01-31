import { POINT_TYPES, UpdateType } from '../const.js';
import { sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice } from '../utils/util-waypoint.js';
import Observable from '../framework/observable.js';

function createPoint(point, offers, destination, allAvailableOffers, alldestinations, allTypes, destinationNames){
  return {
    id:point.id,
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
  };
}

export default class WaypointModel extends Observable {
  #offers = null;
  #destinationNames = null;
  #destinations = null;
  #waypoints = null;
  #humanizedWaypoints = null;
  #allTypes = POINT_TYPES;
  #waypointApiService = null;

  constructor({waypointApiService}){
    super();
    this.#waypointApiService = waypointApiService;
  }

  async init(){
    try{
      const waypoints = await this.#waypointApiService.waypoints;
      this.#waypoints = waypoints.map(this.#adaptToClient);
      const destinations = await this.#waypointApiService.destinations;
      this.#destinations = destinations;
      this.#destinationNames = this.#destinations.map((destination) => destination.name);
      const offers = await this.#waypointApiService.offers;
      this.#offers = offers;
    }catch(err){
      this.#waypoints = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  get cities() {
    return this.#destinationNames;
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
    if(this.#humanizedWaypoints === null){
      this.#humanizedWaypoints = [];
      const cloneWaypoints = this.#waypoints;
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
      this.#waypoints = this.#humanizedWaypoints;
      return this.#humanizedWaypoints.sort(sortWaypointByDate);
    }else{
      return this.#humanizedWaypoints;
    }
  }

  #adaptToClient(waypoint) {
    const adaptedWaypoint = {...waypoint,
      basePrice: waypoint['base_price'],
      dateFrom: waypoint['date_from'] !== null ? new Date(waypoint['date_from']) : waypoint['date_from'],
      dateTo: waypoint['date_to'] !== null ? new Date(waypoint['date_to']) : waypoint['date_to'],
      isFavorite: waypoint['is_favorite'],
    };

    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
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

  async updateWaypoint(updateType, update){
    const index = this.#humanizedWaypoints.findIndex(((waypoint) => waypoint.id === update.id));

    if(index === -1){
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      this.#humanizedWaypoints = [
        ...this.#humanizedWaypoints.slice(0, index),
        update,
        ...this.#humanizedWaypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  }

  async addWaypoint(updateType, update){
    try {
      const response = await this.#waypointApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#humanizedWaypoints = [
        update,
        ...this.#humanizedWaypoints,
      ];
      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new Error('Can\'t add waypoint');
    }
  }

  async deleteWaypoint(updateType, update){
    const index = this.#humanizedWaypoints.findIndex(((waypoint) => waypoint.id === update.id));

    if(index === -1){
      throw new Error('Can\'t delete unexisting waypoint');
    }

    try {
      await this.#waypointApiService.deleteWaypoint(update);
      this.#humanizedWaypoints = [
        ...this.#humanizedWaypoints.slice(0, index),
        ...this.#humanizedWaypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete waypoint');
    }
  }
}

