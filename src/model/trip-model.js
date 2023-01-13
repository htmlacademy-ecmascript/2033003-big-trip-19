import { humanizeWaypointDate } from '../utils/util-waypoint.js';

export default class TripModel {
  #waypoints = null;

  constructor(waypoints) {
    this.#waypoints = waypoints;
  }

  get trip() {
    const trip = {};
    const firstWaypoint = this.#waypoints[0];
    const lastWaypoint = this.#waypoints.slice(-1)[0];
    trip.template = `${firstWaypoint.destination.name}`;
    if(this.#waypoints.length > 3){
      trip.template = `${firstWaypoint.destination.name} — ... — ${lastWaypoint.destination.name}`;
    }else{
      for (let i = 0; i < this.#waypoints.length; i++){
        if(i > 0){
          trip.template += ` — ${this.#waypoints[i].destination.name}`;
        }
      }
    }
    trip.dates = `${humanizeWaypointDate(firstWaypoint.dateFrom)} - ${humanizeWaypointDate(lastWaypoint.dateTo)}`;
    trip.cost = this.#waypoints.reduce((sum, elem) => sum + elem.basePrice, 0);
    return trip;
  }
}
