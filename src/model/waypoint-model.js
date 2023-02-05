import { POINT_TYPES, UpdateType } from '../const.js';
import { newWaypointTemplate, sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice } from '../utils/util-waypoint.js';
import Observable from '../framework/observable.js';

export default class WaypointModel extends Observable {
  #offers = null;
  #destinationNames = null;
  #destinations = null;
  #waypoints = null;
  #humanizedWaypoints = null;
  #waypointApiService = null;
  #newHumanizedWaypoint = null;

  constructor({waypointApiService}){
    super();
    this.#waypointApiService = waypointApiService;
  }

  get humanizedWaypoints(){
    return this.#humanizedWaypoints;
  }

  get newHumanizedWaypoint(){
    return this.#newHumanizedWaypoint;
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
      this.#humanizedWaypoints = this.#getHumanizedWaypoints(this.#waypoints);
      this.#newHumanizedWaypoint = this.#createHumanizedWaypoint({isNewPoint: true, point: newWaypointTemplate, updateType: UpdateType.INIT});
    }
    catch(err){
      this.#waypoints = [];
      this.#humanizedWaypoints = [];
      this.#destinations = [];
      this.#offers = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updateWaypoint(updateType, update){
    const index = this.#humanizedWaypoints.findIndex(((waypoint) => waypoint.id === update.id));

    if(index === -1){
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      const humanizedPoint = this.#createHumanizedWaypoint({point: updatedWaypoint, updateType: updateType});
      this.#humanizedWaypoints = [
        ...this.#humanizedWaypoints.slice(0, index),
        humanizedPoint,
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
      const humanizedPoint = this.#createHumanizedWaypoint({isNewPoint: true, point: newWaypoint, updateType: updateType});
      this.#humanizedWaypoints = [
        humanizedPoint,
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

  #getHumanizedWaypoints(waypoints) {
    if(this.#humanizedWaypoints === null){
      this.#humanizedWaypoints = [];
      this.#humanizedWaypoints = waypoints.map((waypoint) => this.#createHumanizedWaypoint({point: waypoint, updateType: UpdateType.INIT}));
      this.#waypoints = this.#humanizedWaypoints;
      return this.#humanizedWaypoints.sort(sortWaypointByDate);
    }else{
      return this.#humanizedWaypoints;
    }
  }

  #createHumanizedWaypoint({isNewPoint = false, point, updateType} = {}){
    const allAvailableOffers = this.#offers.find((offer) => offer.type === point.type);
    const availableOffers = allAvailableOffers.offers.filter((availableOffer) => point.offers.includes(availableOffer.id));
    const destinationdById = this.#destinations.find((destinationElement) => destinationElement.id === point.destination);

    return this.#createPoint(
      updateType,
      isNewPoint,
      point,
      availableOffers,
      destinationdById,
      allAvailableOffers.offers,
      this.#destinations,
      POINT_TYPES,
      this.#destinationNames,
      this.#offers
    );
  }

  #createPoint(updateType, isNewPoint, point, offers, destination, allAvailableOffers, allDestinations, allTypes, destinationNames, allOffers){
    const result = {
      id: updateType === UpdateType.INIT && isNewPoint ? undefined : point.id,
      basePrice: point.basePrice,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      destination: isNewPoint ? allDestinations[0] : destination,
      isFavorite: point.isFavorite,
      offers: offers,
      type: point.type,
      offersByType: allAvailableOffers,
      allTypes: allTypes,
      allDestinationNames: destinationNames,
      allDestinations: allDestinations,
      allOffers: allOffers
    };

    return result;
  }
}
