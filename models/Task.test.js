const mongoose = require('mongoose');
const Task = require('./Task');

describe('Task Model Unit Tests', () => {
  it('should require a title', async () => {
    const task = new Task({});
    let err;
    try {
      await task.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.title).toBeDefined();
  });

  it('should set default status to pending', async () => {
    const task = new Task({ title: 'Test Task' });
    expect(task.status).toBe('pending');
  });

  it('should accept only valid status values', async () => {
    const task = new Task({ title: 'Test', status: 'invalid' });
    let err;
    try {
      await task.validate();
    } catch (error) {
      err = error;
    }
    expect(err.errors.status).toBeDefined();
  });
});

// Mocking example
describe('Task Model with Mocking', () => {
  it('should call save on the model', async () => {
    const saveMock = jest.fn().mockResolvedValue({ _id: '1', title: 'Mocked' });
    Task.prototype.save = saveMock;
    const task = new Task({ title: 'Mocked' });
    await task.save();
    expect(saveMock).toHaveBeenCalled();
  });
}); 