const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Report = require('../models/Report');

describe('Reports API (basic)', () => {
  beforeAll(async () => {
    // Use a separate in-memory DB or test DB in real setup. Here we connect to MONGO_URI if provided.
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gbv_test_db';
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await Report.deleteMany({});
    await mongoose.connection.close();
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
