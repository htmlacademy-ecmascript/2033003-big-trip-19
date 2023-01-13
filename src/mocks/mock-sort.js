import { sortWaypointByDate, sortWaypointByDuration, sortWaypointByPrice } from '../utils/util-waypoint.js';

const sortTypes = [
  {
    name: 'day',
    waypoints: (waypoints) => waypoints.sort(sortWaypointByDate),
  },
  {
    name: 'event'
  },
  {
    name: 'time',
    waypoints: (waypoints) => waypoints.sort(sortWaypointByDuration)
  },
  {
    name :'price',
    waypoints: (waypoints) => waypoints.sort(sortWaypointByPrice)
  },
  {
    name :'offer'
  },
];

export {sortTypes};
