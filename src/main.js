import TripInfoView from './view/trip-info.js';
import FilterContainerView from './view/filter-container-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import {render} from './render.js';
import SortContainerView from './view/sort-container-view.js';
import WaypointModel from './model/waypoint-model.js';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');
const waypointModel = new WaypointModel();
const contentPresenter = new ContentPresenter({contentContainer: siteSortEventsElement, waypointModel});


render(new TripInfoView(), siteTripMain,'AFTERBEGIN');
render(new FilterContainerView(), siteFilterEventsElement);
render(new SortContainerView,siteSortEventsElement);

contentPresenter.init();
