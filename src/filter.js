const currentDate = new Date();

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
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom > currentDate),
  },
  {
    name: 'present',
    isChecked: false,
    message: 'There are no present events now',
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateFrom <= currentDate && waypoint.dateTo >= currentDate),
  },
  {
    name :'past',
    isChecked: false,
    message: 'There are no past events now',
    waypoints: (waypoints) => waypoints.filter((waypoint) => waypoint.dateTo < currentDate),
  },
];

export {filterTypes};
