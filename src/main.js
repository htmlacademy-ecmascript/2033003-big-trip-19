import TripInfoView from './view/trip-info.js';
import ContentPresenter from './presenter/content-presenter.js';
import {render} from './render.js';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');

const contentPresenter = new ContentPresenter({contentContainer: siteSortEventsElement, filtersContainer: siteFilterEventsElement, sortingsContainer: siteSortEventsElement});

render(new TripInfoView(), siteTripMain,'AFTERBEGIN');

contentPresenter.init();
