import { getRandomArrayElement } from "./util";

const WAYPOINTS = [
  {
    date:'2019-03-18',
    icon:'taxi',
    title:'Taxi Amsterdam',
    startTime: '2019-03-18T10:30',
    endTime: '2019-03-18T11:00',
    eventPrice:20,
    offers:[{
      offerTitle:'Order Uber',
      offerPrice:20,
    }]
  },
  {
    date:'2019-03-18',
    icon:'flight',
    title:'Flight Chamonix',
    startTime: '2019-03-18T12:25',
    endTime: '2019-03-18T13:35',
    eventPrice:160,
    offers:[{
      offerTitle:'Add luggage',
      offerPrice:50,
    },{
      offerTitle:'Switch to comfort',
      offerPrice:80,
    }]
  },
  {
    date:'2019-03-18',
    icon:'drive',
    title:'Drive Chamonix',
    startTime: '2019-03-18T14:30',
    endTime: '2019-03-18T16:05',
    eventPrice:160,
    offers:[{
      offerTitle:'Rent a car',
      offerPrice:200,
    }]
  },
  {
    date:'2019-03-18',
    icon:'check-in',
    title:'Check-in Chamonix',
    startTime: '2019-03-18T12:25',
    endTime: '2019-03-18T13:35',
    eventPrice:600,
    offers:[{
      offerTitle:'Add breakfast',
      offerPrice:50,
    }]
  },
  {
    date:'2019-03-19',
    icon:'sightseeing',
    title:'Sightseeing Chamonix',
    startTime: '2019-03-19T11:20',
    endTime: '2019-03-19T13:00',
    eventPrice:50,
    offers:[{
      offerTitle:'Book tickets',
      offerPrice:40,
    },{
      offerTitle:'Lunch in city',
      offerPrice:30,
    }]
  },
  {
    date:'2019-03-19',
    icon:'drive',
    title:'Drive Geneva',
    startTime: '2019-03-19T10:00',
    endTime: '2019-03-19T11:00',
    eventPrice:20,
    offers:[]
  },
  {
    date:'2019-03-19',
    icon:'flight',
    title:'Flight Geneva',
    startTime: '2019-03-19T18:00',
    endTime: '2019-03-19T19:00',
    eventPrice:20,
    offers:[{
      offerTitle:'Add luggage',
      offerPrice:30,
    },{
      offerTitle:'Switch to comfort',
      offerPrice:100,
    }]
  },
  {
    date:'2019-03-20',
    icon:'drive',
    title:'Drive Geneva',
    startTime: '2019-03-20T08:25',
    endTime: '2019-03-20T09:25',
    eventPrice:20,
    offers:[]
  },
  {
    date:'2019-03-20',
    icon:'sightseeing',
    title:'Sightseeing Geneva',
    startTime: '2019-03-20T11:15',
    endTime: '2019-03-20T12:15',
    eventPrice:180,
    offers:[]
  }
];

const getRandomWaypoint = () => getRandomArrayElement(WAYPOINTS);

export {WAYPOINTS, getRandomWaypoint};
