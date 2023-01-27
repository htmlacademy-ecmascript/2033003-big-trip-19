import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom.getTime() > new Date().getTime()),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom.getTime() <= new Date().getTime() && waypoint.dateTo.getTime() >= new Date().getTime()),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => waypoint.dateTo.getTime() < new Date().getTime()),
};

export {filter};
