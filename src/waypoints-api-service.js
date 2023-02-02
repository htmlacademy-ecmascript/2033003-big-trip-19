import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class WaypointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'points'})
      //.then(() => ([]));
      .then(ApiService.parseResponse);
  }

  get destinations(){
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers(){
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addWaypoint(waypoint){
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  }

  async deleteWaypoint(waypoint) {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(waypoint){
    const adaptedWaypoint = {...waypoint,
      'base_price': waypoint.basePrice,
      'date_from': waypoint.dateFrom instanceof Date ? waypoint.dateFrom.toISOString() : null,
      'date_to': waypoint.dateTo instanceof Date ? waypoint.dateTo.toISOString() : null,
      'is_favorite': waypoint.isFavorite
    };
    adaptedWaypoint.destination = waypoint.destination.id;

    adaptedWaypoint.offers = waypoint.offers.map((element) => element.id);
    adaptedWaypoint.offers.sort((a, b) => a - b);

    delete adaptedWaypoint.basePrice;
    delete adaptedWaypoint.dateFrom;
    delete adaptedWaypoint.dateTo;
    delete adaptedWaypoint.isFavorite;
    delete adaptedWaypoint.allDestinationNames;
    delete adaptedWaypoint.allDestinations;
    delete adaptedWaypoint.allOffers;
    delete adaptedWaypoint.allTypes;
    delete adaptedWaypoint.offersByType;

    return adaptedWaypoint;
  }
}
