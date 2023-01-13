import ContentPresenter from './presenter/content-presenter.js';

const siteTripMain = document.querySelector('.trip-main');
const siteFilterEventsElement = document.querySelector('.trip-controls__filters');
const siteSortEventsElement = document.querySelector('.trip-events');

const contentPresenter = new ContentPresenter(
  {
    contentContainer: siteSortEventsElement,
    filtersContainer: siteFilterEventsElement,
    sortingsContainer: siteSortEventsElement,
    tripContainer: siteTripMain
  }
);

contentPresenter.init();
