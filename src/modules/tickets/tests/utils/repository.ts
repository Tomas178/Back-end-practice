import { SCREENINGS } from '@/modules/screenings/tests/utils/repository';
import { USERS } from '@/modules/users/tests/utils/repository';

export const TICKETS = [
  {
    id: 1,
    userId: USERS[0].id,
    screeningId: SCREENINGS[0].id,
    createdAt: '2025-05-26',
  },
  {
    id: 2,
    userId: USERS[1].id,
    screeningId: SCREENINGS[1].id,
    createdAt: '2025-05-26',
  },
  {
    id: 3,
    userId: USERS[2].id,
    screeningId: SCREENINGS[2].id,
    createdAt: '2025-05-26',
  },
];

export const INSERTABLE_TICKETS = [
  {
    userId: TICKETS[0].userId,
    screeningId: TICKETS[0].screeningId,
  },
  {
    userId: TICKETS[1].userId,
    screeningId: TICKETS[1].screeningId,
  },
  {
    userId: TICKETS[2].userId,
    screeningId: TICKETS[2].screeningId,
  },
];
