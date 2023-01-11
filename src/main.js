import TripInfoView from './view/trip-info.js';
import ContentPresenter from './presenter/content-presenter.js';
import {render} from './render.js';
import SortContainerView from './view/sort-container-view.js';
import { SortType } from './const.js';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');

const contentPresenter = new ContentPresenter({contentContainer: siteSortEventsElement, filtersContainer: siteFilterEventsElement});

render(new TripInfoView(), siteTripMain,'AFTERBEGIN');
render(new SortContainerView({sortings: SortType}),siteSortEventsElement);

contentPresenter.init();
