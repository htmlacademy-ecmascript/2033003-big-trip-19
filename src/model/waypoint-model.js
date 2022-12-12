import { getRandomWaypoint} from '../mock.js';
import { getRandomArrayElement } from '../util.js';

const WAYPOINT_COUNT = 3;
export default class WaypointModel{
  waypoints = Array.from({length: WAYPOINT_COUNT},getRandomWaypoint);
  getWaypoints(){
    return this.waypoints;
  }
}
