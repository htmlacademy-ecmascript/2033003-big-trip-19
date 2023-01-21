import FilterModel from './model/filter-model.js';
import WaypointModel from './model/waypoint-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { render } from './render.js';
import FilterContainerView from './view/filter-container-view.js';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const waypointModel = new WaypointModel();

const filterPresenter = new FilterPresenter({
  filterContainer: siteFilterEventsElement, 
  filterModel,
  waypointModel
});

const contentPresenter = new ContentPresenter(
  {
    contentContainer: siteSortEventsElement,
    sortingsContainer: siteSortEventsElement,
    tripContainer: siteTripMain,
    waypointModel,
    filterModel
  }
);

filterPresenter.init();
contentPresenter.init();
