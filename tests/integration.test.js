const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8082, () => console.log('Integration Testing on PORT 8082'))
const User = require('../models/user')
const Engineer = require('../models/engineer') 
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  await mongoose.connection.close()
  mongoServer.stop()
  server.close()
})

afterEach(async () => {
  await User.deleteMany({})
  await Engineer.deleteMany({})
})

describe('Integration Tests', () => {
  describe('Complete User and Engineer Flow', () => {
    test('should create user, login, and manage engineers', async () => {
      // Step 1: Create a new user
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      }

      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)

      const authToken = createResponse.body.token

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({ email: userData.email, password: userData.password })
        .expect(200)

      const loginToken = loginResponse.body.token

      // Step 3: Get Profile
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200)

      expect(profileResponse.body.user.email).toBe(userData.email)

      // Step 4: Create an Engineer
      const engineerData = {
        name: 'Ali',
        specialization: 'Mechanical',
        available: true
      }

      const createEngineer = await request(app)
        .post('/api/engineers')
        .set('Authorization', `Bearer ${loginToken}`)
        .send(engineerData)
        .expect(201)

      expect(createEngineer.body.name).toBe(engineerData.name)

      const engineerId = createEngineer.body._id

      // Step 5: Get All Engineers
      const allEngineers = await request(app)
        .get('/api/engineers')
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200)

      expect(allEngineers.body).toHaveLength(1)

      // Step 6: Get Single Engineer
      const singleEngineer = await request(app)
        .get(`/api/engineers/${engineerId}`)
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200)

      expect(singleEngineer.body.name).toBe(engineerData.name)

      // Step 7: Update Engineer
      const updateData = {
        name: 'Ali Updated',
        specialization: 'Aerospace',
        available: false
      }

      const updatedEngineer = await request(app)
        .put(`/api/engineers/${engineerId}`)
        .set('Authorization', `Bearer ${loginToken}`)
        .send(updateData)
        .expect(200)

      expect(updatedEngineer.body.name).toBe(updateData.name)

      // Step 8: Delete Engineer
      const deleteEngineer = await request(app)
        .delete(`/api/engineers/${engineerId}`)
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200)

      expect(deleteEngineer.body.message).toBe('Engineer successfully deleted')

      // Step 9: Verify deletion
      const finalCheck = await request(app)
        .get('/api/engineers')
        .set('Authorization', `Bearer ${loginToken}`)
        .expect(200)

      expect(finalCheck.body).toHaveLength(0)
    })
  })

  describe('Authentication Flow', () => {
    test('should handle auth errors for engineers', async () => {
      await request(app)
        .get('/api/engineers')
        .expect(401)

      await request(app)
        .get('/api/engineers')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      await request(app)
        .get('/api/engineers')
        .set('Authorization', 'Bearer')
        .expect(401)
    })
  })

  describe('Error Handling', () => {
    test('should handle bad user and login data', async () => {
      await request(app)
        .post('/api/users')
        .send({})
        .expect(400)

      const login = await request(app)
        .post('/api/users/login')
        .send({ email: 'wrong@example.com', password: 'nope' })
        .expect(400)

      expect(login.body.message).toBe('Invalid login credentials')
    })
  })
})
