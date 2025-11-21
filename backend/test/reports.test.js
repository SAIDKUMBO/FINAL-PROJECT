const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('Reports API (basic)', () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), { dbName: 'testdb' });
  });

  afterAll(async () => {
    await Report.deleteMany({});
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) await mongoServer.stop();
  });

  test('POST /api/reports creates a report (requires Authorization header)', async () => {
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', 'Bearer testtoken')
      .send({ title: 'Test', description: 'Testing', anonymous: true });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.title).toBe('Test');
  }, 20000);
});
