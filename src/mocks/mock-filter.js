import { DateType } from '../const.js';

const filterTypes = [
  {
    name: 'everything',
    isChecked: true,
    message: 'Click New Event to create your first point',
    waypoints: (waypoints) => waypoints,
  },
  {
    name: 'future',
    isChecked: false,
    message: 'There are no future events now',
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom.getTime() > DateType.CURRENTDATE.getTime()),
  },
  {
    name: 'present',
    isChecked: false,
    message: 'There are no present events now',
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom.getTime() <= DateType.CURRENTDATE.getTime() && waypoint.dateTo.getTime() >= DateType.CURRENTDATE.getTime()),
  },
  {
    name :'past',
    isChecked: false,
    message: 'There are no past events now',
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateTo.getTime() < DateType.CURRENTDATE.getTime()),
  },
];

export {filterTypes};
