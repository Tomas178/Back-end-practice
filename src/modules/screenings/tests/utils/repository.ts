import { format } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';

export const MOVIES = [
  {
    id: 1,
    title: 'A horror movie',
    year: 2025,
  },
  {
    id: 25,
    title: 'A fantasy movie',
    year: 2004,
  },
  {
    id: 4,
    title: 'A documentary movie',
    year: 2015,
  },
];

export const SCREENINGS = [
  {
    id: 1,
    movieId: MOVIES[0].id,
    totalTickets: 1500,
    leftTickets: 1500,
    createdAt: '2025-07-14',
  },
  {
    id: 26,
    movieId: MOVIES[1].id,
    totalTickets: 2500,
    leftTickets: 2499,
    createdAt: '2004-05-26',
  },
  {
    id: 50,
    movieId: MOVIES[2].id,
    totalTickets: 150,
    leftTickets: 1,
    createdAt: '2014-01-01',
  },
];

export const INSERTABLE_SCREENINGS = [
  {
    movieId: MOVIES[0].id,
    totalTickets: 1500,
    leftTickets: 1500,
  },
  {
    movieId: MOVIES[1].id,
    totalTickets: 2500,
    leftTickets: 2499,
  },
  {
    movieId: MOVIES[2].id,
    totalTickets: 150,
    leftTickets: 1,
  },
];

export const IDS_TO_UPDATE = SCREENINGS.map((screening) => screening.id);
export const PROPERTIES_TO_UPDATE = [
  { leftTickets: SCREENINGS[0].leftTickets - 1 },
  {
    totalTickets: SCREENINGS[1].totalTickets * 2,
    leftTickets: SCREENINGS[1].leftTickets * 2,
  },
  {
    totalTickets: SCREENINGS[2].totalTickets % 2,
    leftTickets: (SCREENINGS[2].leftTickets % 2) - 1,
    createdAt: format(Date.now(), DATE_FORMAT),
  },
];

export const UPDATED_SCREENINGS = [
  {
    ...SCREENINGS[0],
    ...PROPERTIES_TO_UPDATE[0],
  },
  {
    ...SCREENINGS[1],
    ...PROPERTIES_TO_UPDATE[1],
  },
  {
    ...SCREENINGS[2],
    ...PROPERTIES_TO_UPDATE[2],
  },
];
