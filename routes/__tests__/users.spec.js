const request = require('supertest');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('../../models/Users');
const userRoutes = require('../users');

app.use(bodyParser.json());
app.use('/', userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user', async () => {
    // Mock User.findOne to simulate no existing user
    User.findOne = jest.fn().mockResolvedValue(null);

    // Mock User.prototype.save to avoid actual database operations
    User.prototype.save = jest.fn();

    // Perform the request
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
        email: 'test@example.com',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully');
    expect(User.prototype.save).toHaveBeenCalled();
  });

  test('should log in an existing user', async () => {
    // Mock User.findOne to simulate an existing user
    User.findOne = jest.fn().mockResolvedValue({
      username: 'testuser',
      password: '$2b$10$yYLOE2gHSQHKPZu5lGah8u.B87tzMNep2B7AXGBmV9vZzw4EvYcq2', // Hashed password
    });

    // Mock bcrypt.compare to always return true
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    // Perform the request
    const response = await request(app)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'testpassword', // Plain password
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  test('should check if user exists - user exists', async () => {
    // Mock User.findOne to simulate an existing user
    User.findOne = jest.fn((query, callback) => {
      if (query.username === 'existinguser') {
        callback(null, { username: 'existinguser' });
      } else {
        callback(null, null);
      }
    });

    // Perform the request
    const response = await request(app)
      .post('/check-user-exists')
      .send({
        username: 'existinguser',
      });

    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(true);
  });

  test('should check user availability - user does not exist', async () => {
    // Mock User.findOne to simulate no existing user
    User.findOne = jest.fn((query, callback) => {
      callback(null, null);
    });

    // Perform the request
    const response = await request(app)
      .post('/check-availability')
      .send({
        username: 'nonexistentuser',
        email: 'nonexistent@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body.available).toBe(true);
  });
});