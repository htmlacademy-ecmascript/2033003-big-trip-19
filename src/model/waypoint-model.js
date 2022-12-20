import { createDataPoints} from '../mock-waypoint.js';
export default class WaypointModel{
  #waypoints = Array.from(createDataPoints());

  sortWaypoints(){
    return this.#waypoints.sort((a, b) => a.dateFrom > b.dateFrom ? 1 : -1);
  }

  getWaypoints(){
    return this.#waypoints;
  }
}
