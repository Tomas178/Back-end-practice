import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';
import {
  IDS_TO_UPDATE,
  INSERTABLE_SCREENINGS,
  MOVIES,
  PROPERTIES_TO_UPDATE,
  SCREENINGS,
  UPDATED_SCREENINGS,
} from './utils/repository';

const db = await createTestDatabase();
const repository = buildRepository(db);
const createScreenings = createFor(db, 'screenings');
const createMovies = createFor(db, 'movies');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('screenings').execute();
  await db.deleteFrom('movies').execute();
});

describe('Screenings returns', () => {
  it('should return all existing screenings', async () => {
    await createMovies([MOVIES[0]]);

    await createScreenings(SCREENINGS[0]);

    const screenings = await repository.findAll();

    expect(screenings).toEqual([SCREENINGS[0]]);
  });

  it('Should return screening by given ID', async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);

    const screening = await repository.findById(SCREENINGS[1].id);

    expect(screening).toEqual(SCREENINGS[1]);
  });

  it('Returns screenings by their IDs', async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);

    const screenings = await repository.findByIds(
      SCREENINGS.map((screening) => screening.id)
    );

    expect(screenings).toEqual(SCREENINGS);
  });
});

describe('Screenings adding', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
  });

  it('Adds one screening successfully', async () => {
    const screening = await repository.create(INSERTABLE_SCREENINGS[0]);

    if (screening) {
      expect(screening).toEqual(await repository.findById(screening.id));
    }
  });

  it('Adds multiple screenings correctly', async () => {
    const screening1 = await repository.create(INSERTABLE_SCREENINGS[0]);
    const screening2 = await repository.create(INSERTABLE_SCREENINGS[1]);
    const screening3 = await repository.create(INSERTABLE_SCREENINGS[2]);

    const createdScreenings = [screening1, screening2, screening3];
    const retrievedScreenings = await repository.findByIds(
      createdScreenings.map((screening) => screening.id)
    );

    expect(retrievedScreenings).toHaveLength(createdScreenings.length);
    expect(createdScreenings).toEqual(retrievedScreenings);
  });
});

describe('Updating screenings', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
  });

  it('Successfully updates one screening', async () => {
    const updatedScreening = await repository.update(
      IDS_TO_UPDATE[0],
      PROPERTIES_TO_UPDATE[0]
    );

    expect(updatedScreening).toEqual(UPDATED_SCREENINGS[0]);
  });

  it('Successfully updates multiple screenings', async () => {
    const updatedScreening1 = await repository.update(
      IDS_TO_UPDATE[0],
      PROPERTIES_TO_UPDATE[0]
    );
    const updatedScreening2 = await repository.update(
      IDS_TO_UPDATE[1],
      PROPERTIES_TO_UPDATE[1]
    );
    const updatedScreening3 = await repository.update(
      IDS_TO_UPDATE[2],
      PROPERTIES_TO_UPDATE[2]
    );

    const updatedScreenings = [
      updatedScreening1,
      updatedScreening2,
      updatedScreening3,
    ];

    expect(updatedScreenings).toHaveLength(3);
    expect(updatedScreenings).toEqual(UPDATED_SCREENINGS);
  });
});

describe('Deletes screenings', () => {
  beforeEach(async () => {
    await createMovies(MOVIES);
    await createScreenings(SCREENINGS);
  });

  it('Should delete successfully one row', async () => {
    await repository.delete(SCREENINGS[0].id);
    const deletedScreening = await repository.findById(SCREENINGS[0].id);

    expect(deletedScreening).toBeUndefined();
  });
});
