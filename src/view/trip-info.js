import AbstractView from '../framework/view/abstract-view.js';
import { humanizeWaypointDate } from '../utils/util-waypoint.js';

const getTemplateForTrip = (waypoints) =>{
  let trip = '';
  const firstWaypoint = waypoints[0];
  const lastWaypoint = waypoints.slice(-1)[0];

  if(waypoints.length > 3){
    trip = `${firstWaypoint.destination.name} — ... — ${lastWaypoint.destination.name}`;
  }else{
    for (let i = 0; i < waypoints.length; i++){
      if(i === 0){
        trip += `${waypoints[i].destination.name}`;
      }else if(i > 0){
        trip += ` — ${waypoints[i].destination.name}`;
      }
    }
  }
  return trip;
};

const getStartAndEndDate = (waypoints) => {
  let dates = '';
  const firstWaypoint = waypoints[0];
  const lastWaypoint = waypoints.slice(-1)[0];
  dates = `${humanizeWaypointDate(firstWaypoint.dateFrom)} - ${humanizeWaypointDate(lastWaypoint.dateTo)}`;
  return dates;
};

function createTripInfoTemplate(cost, waypoints) {
  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTemplateForTrip(waypoints)}</h1>

    <p class="trip-info__dates">${getStartAndEndDate(waypoints)}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
  </p>
</section>`;
}
export default class TripInfoView extends AbstractView {
  #waypoints = null;
  #cost = null;

  constructor({waypoints}){
    super();
    this.#waypoints = waypoints;
  }

  #calculateСost(){
    this.#cost = this.#waypoints.reduce((sum, elem) => sum + elem.basePrice, 0);
  }

  get template() {
    this.#calculateСost();
    return createTripInfoTemplate(this.#cost, this.#waypoints);
  }
}
