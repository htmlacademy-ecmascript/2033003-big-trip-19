import { humanizeWaypointDate } from '../utils/util-waypoint.js';

export default class TripModel {
  #waypoints = null;

  constructor(waypoints) {
    this.#waypoints = waypoints;
  }

  get trip(){
    const trip = {};
    if(this.#waypoints.length !== 0){
      const firstWaypoint = this.#waypoints[0];
      const lastWaypoint = this.#waypoints.slice(-1)[0];

      if (this.#waypoints.length > 3) {
        trip.template = `${firstWaypoint.destination.name} — ... — ${lastWaypoint.destination.name}`;
      } else {
        let mappedWaypoints = this.#waypoints.slice(1).map(waypoint => waypoint.destination.name);
        if (this.#waypoints.length > 1) {
          trip.template = mappedWaypoints.join(' — ');
          trip.template = `${firstWaypoint.destination.name} — ${trip.template}`;
        } else {
          trip.template = firstWaypoint.destination.name;
        }
      }
      trip.dates = `${humanizeWaypointDate(firstWaypoint.dateFrom)} - ${humanizeWaypointDate(lastWaypoint.dateTo)}`;
      trip.cost = this.#waypoints.reduce((sum, elem) => sum + elem.basePrice, 0);
    }
    return trip;
  }
}
