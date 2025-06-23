const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const taskRoutes = require('./tasks');

const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

// Integration tests (with in-memory DB would be ideal, but here we mock DB methods for simplicity)
jest.mock('../models/Task');

describe('Task API Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/tasks should return all tasks', async () => {
    Task.find.mockResolvedValue([{ title: 'Task1' }]);
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ title: 'Task1' }]);
  });

  it('GET /api/tasks/:id should return a task', async () => {
    Task.findById.mockResolvedValue({ _id: '1', title: 'Task1' });
    const res = await request(app).get('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Task1');
  });

  it('POST /api/tasks should create a task', async () => {
    Task.prototype.save = jest.fn().mockResolvedValue({ _id: '1', title: 'New Task' });
    const res = await request(app).post('/api/tasks').send({ title: 'New Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Task');
  });

  it('PUT /api/tasks/:id should update a task', async () => {
    Task.findByIdAndUpdate.mockResolvedValue({ _id: '1', title: 'Updated Task' });
    const res = await request(app).put('/api/tasks/1').send({ title: 'Updated Task' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Task');
  });

  it('DELETE /api/tasks/:id should delete a task', async () => {
    Task.findByIdAndDelete.mockResolvedValue({ _id: '1', title: 'Task1' });
    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Task deleted successfully');
  });
}); 