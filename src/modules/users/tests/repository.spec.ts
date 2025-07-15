import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import buildRepository from '../repository';
import { INSERTABLE_USERS, USERS } from './utils/repository';

const db = await createTestDatabase();

const repository = buildRepository(db);
const createUsers = createFor(db, 'users');

afterAll(() => db.destroy());

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

describe('Get users', () => {
  beforeEach(async () => {
    await createUsers(USERS);
  });

  it('Successfully returns all users', async () => {
    const users = await repository.findAll();
    expect(users).toEqual(USERS);
  });

  it('Successfully returns user by ID', async () => {
    const user = await repository.findById(USERS[0].id);
    expect(user).toEqual(USERS[0]);
  });

  it('Successfully returns users by given IDs', async () => {
    const users = await repository.findByIds([USERS[0].id, USERS[1].id]);
    expect(users).toEqual([USERS[0], USERS[1]]);
  });
});

describe('Create users', () => {
  it('Successfully creates one user', async () => {
    const createdUser = await repository.create(INSERTABLE_USERS[0]);
    expect(createdUser).toEqual(await repository.findById(createdUser.id));
  });
});
