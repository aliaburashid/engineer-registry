const request = require('supertest') // loads supertest a tool used to send test requests to your Express app
const mongoose = require('mongoose') // Loads Mongoose so you can manage your MongoDB connection and interact with your models.
// Loads a package that creates a temporary, in-memory MongoDB database just for testing.
// This means: No real database is touched and Data is reset every time you run tests
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app') // Imports your main Express app
const server = app.listen(8080, () => console.log('Testing on PORT 8080'))
// loads the user model so you can create, delete and update users
const User = require('../models/user')
const bcrypt = require('bcrypt')
// Creates a variable mongoServer that you will later use to start and 
// stop the in-memory database during your test lifecycle.
let mongoServer

// runs once before all tests
beforeAll(async () => {
    // This starts a brand-new temporary MongoDB server in memory.
    // It's not a real database on your machine — it lives only while the tests run.
    // You store it in the mongoServer variable so you can stop it later.
    mongoServer = await MongoMemoryServer.create()
    // This tells Mongoose to connect to the in-memory database using the temporary URI.
    // useNewUrlParser: true ensures the new way of parsing the connection string is used.
    // useUnifiedTopology: true ensures Mongoose uses the new, more stable connection engine.
    await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

// runs once after all tests finish, It's where you clean up and close everything.
afterAll(async () => {
    await mongoose.connection.close() // This disconnects Mongoose from the in-memory database to free up memory.
    mongoServer.stop() // This shuts down the in-memory MongoDB server completely. After this, the temporary DB is gone.
    server.close() // This closes your Express app's server that was listening on port 8080.
})
afterEach(async () => {
  await User.deleteMany({})
})

describe('User API Tests', () => {
  describe('POST /api/users', () => {
    test('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.name).toBe(userData.name)
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.password).toBeUndefined() // Password should not be returned
    })

    test('should return 400 for invalid user data', async () => {
      const invalidUserData = {
        name: 'John Doe'
        // Missing email and password
      }

      const response = await request(app)
        .post('/api/users')
        .send(invalidUserData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      const user = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
      await user.save()
    })

    test('should login user with valid credentials', async () => {
      const loginData = {
        email: 'john.doe@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/users/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user.email).toBe(loginData.email)
    })

    test('should return 400 for invalid credentials', async () => {
      const invalidLoginData = {
        email: 'john.doe@example.com',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/users/login')
        .send(invalidLoginData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('Invalid login credentials')
    })
  })

  describe('GET /api/users/profile', () => {
    let user, token

    beforeEach(async () => {
      user = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
      await user.save()
      token = await user.generateAuthToken()
    })

    test('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('user')
      expect(response.body.user.name).toBe(user.name)
      expect(response.body.user.email).toBe(user.email)
    })

    test('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401)

      expect(response.text).toBe('Not authorized')
    })

    test('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401)

      expect(response.text).toBe('Not authorized')
    })
  })

  describe('PUT /api/users/:id', () => {
    let user, token

    beforeEach(async () => {
      user = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
      await user.save()
      token = await user.generateAuthToken()
    })

    test('should update user with valid data', async () => {
      const updateData = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com'
      }

      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200)

      expect(response.body.name).toBe(updateData.name)
      expect(response.body.email).toBe(updateData.email)
    })

    test('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const updateData = { name: 'Jane Doe' }

      const response = await request(app)
        .put(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(404)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('User not found')
    })
  })

  describe('DELETE /api/users/:id', () => {
    let user, token

    beforeEach(async () => {
      user = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      })
      await user.save()
      token = await user.generateAuthToken()
    })

    test('should delete user successfully', async () => {
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toBe('User deleted successfully')

      // Verify user is actually deleted
      const deletedUser = await User.findById(user._id)
      expect(deletedUser).toBeNull()
    })

    test('should return 401 without token', async () => {
      const response = await request(app)
        .delete(`/api/users/${user._id}`)
        .expect(401)

      expect(response.text).toBe('Not authorized')
    })
  })
})