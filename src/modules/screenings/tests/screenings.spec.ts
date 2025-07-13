import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import createApp from '@/app';

const db = await createTestDatabase();

const app = createApp(db);

describe('GET', () => {
  it('Should return 0 screenings if no ids are provided and no screenings are added in the database', async () => {
    const { body } = await supertest(app).get('/screenings').expect(200);

    expect(body).toHaveLength(0);
  });

  it.todo('Should return all the screenings in the database', async () => {
    await supertest(app).post('/screenings').expect(201);
    const { body } = await supertest(app).get('/screenings').expect(200);
    expect(body).toHaveLength(3);
  });
});
