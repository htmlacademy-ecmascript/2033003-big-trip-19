import FilterModel from './model/filter-model.js';
import WaypointModel from './model/waypoint-model.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import { returnRandomString } from './utils/common.js';
import NewWaypointButtonView from './view/new-waypoint-button-view.js';
import WaypointsApiService from './waypoints-api-service.js';

const AUTHORIZATION = `Basic ${returnRandomString()}`;
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip/';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const waypointModel = new WaypointModel({
  waypointApiService: new WaypointsApiService(END_POINT, AUTHORIZATION)
});

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
    filterModel,
    onNewWaypointDestroy: handleNewWaypointFormClose
  }
);

const newWaypointButtonComponent = new NewWaypointButtonView({
  onClick: handleNewWaypointButtonClick
});
newWaypointButtonComponent.addButton.disabled = true;

function handleNewWaypointFormClose() {
  newWaypointButtonComponent.addButton.disabled = false;
}

function handleNewWaypointButtonClick() {
  contentPresenter.createWaypoint();
  newWaypointButtonComponent.addButton.disabled = true;
}

waypointModel.init()
  .finally(() => {
    newWaypointButtonComponent.addButton.disabled = false;
  });
filterPresenter.init();
contentPresenter.init();


