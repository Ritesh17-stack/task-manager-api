const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');
const Task = require('../models/Task');
const taskRoutes = require('./tasks');

let mongod;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = express();
  app.use(express.json());
  app.use('/api/tasks', taskRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Task.deleteMany();
});

describe('Task API Integration', () => {
  it('should create a new task', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Integration Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Integration Task');
    expect(res.body.status).toBe('pending');
  });

  it('should get all tasks', async () => {
    await Task.create({ title: 'Task1' });
    await Task.create({ title: 'Task2' });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should get a task by id', async () => {
    const task = await Task.create({ title: 'FindMe' });
    const res = await request(app).get(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('FindMe');
  });

  it('should update a task', async () => {
    const task = await Task.create({ title: 'Old' });
    const res = await request(app).put(`/api/tasks/${task._id}`).send({ title: 'New' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New');
  });

  it('should delete a task', async () => {
    const task = await Task.create({ title: 'DeleteMe' });
    const res = await request(app).delete(`/api/tasks/${task._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Task deleted successfully');
  });
}); 