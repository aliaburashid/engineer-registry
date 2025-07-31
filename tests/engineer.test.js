const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../app')
const server = app.listen(8081, () => console.log('Testing Engineers on PORT 8081'))
const User = require('../models/user')
const Engineer = require('../models/engineer')
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
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

describe('Engineer API Tests', () => {
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

  describe('GET /api/engineers', () => {
    test('should get all engineers for authenticated user', async () => {
      const eng1 = new Engineer({ name: 'Ali', specialty: 'Civil', available: true })
      const eng2 = new Engineer({ name: 'Sara', specialty: 'Software', available: false })
      await eng1.save()
      await eng2.save()

      user.engineers.addToSet(eng1._id, eng2._id)
      await user.save()

      const res = await request(app)
        .get('/api/engineers')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body.length).toBe(2)
      expect(res.body[0]).toHaveProperty('name')
      expect(res.body[0]).toHaveProperty('specialty')
      expect(res.body[0]).toHaveProperty('available')
    })

    test('should return 401 without token', async () => {
      const res = await request(app).get('/api/engineers').expect(401)
      expect(res.text).toBe('Not authorized')
    })
  })

  describe('GET /api/engineers/:id', () => {
    test('should get single engineer by id', async () => {
      const engineer = new Engineer({ name: 'Layla', specialty: 'Mechanical', available: true })
      await engineer.save()

      const res = await request(app)
        .get(`/api/engineers/${engineer._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toHaveProperty('name', 'Layla')
      expect(res.body).toHaveProperty('specialty', 'Mechanical')
      expect(res.body).toHaveProperty('available', true)
    })

    test('should return 400 for non-existent engineer', async () => {
      const fakeId = new mongoose.Types.ObjectId()
      const res = await request(app)
        .get(`/api/engineers/${fakeId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      expect(res.body).toHaveProperty('message')
    })
  })

  describe('POST /api/engineers', () => {
    test('should create new engineer successfully', async () => {
      const data = { name: 'Zain', specialty: 'Software', available: true }

      const res = await request(app)
        .post('/api/engineers')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(201)

      expect(res.body).toHaveProperty('name', data.name)
      expect(res.body).toHaveProperty('specialty', data.specialty)
      expect(res.body).toHaveProperty('available', data.available)

      const updatedUser = await User.findById(user._id).populate('engineers')
      expect(updatedUser.engineers.length).toBe(1)
      expect(updatedUser.engineers[0].name).toBe(data.name)
    })

    test('should handle checkbox "on" correctly', async () => {
      const data = { name: 'Nada', specialty: 'Electrical', available: 'on' }

      const res = await request(app)
        .post('/api/engineers')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(201)

      expect(res.body).toHaveProperty('available', true)
    })

    test('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/engineers')
        .send({ name: 'Sam', specialty: 'Civil', available: true })
        .expect(401)

      expect(res.text).toBe('Not authorized')
    })
  })

  describe('PUT /api/engineers/:id', () => {
    test('should update engineer successfully', async () => {
      const engineer = new Engineer({ name: 'Huda', specialty: 'Architect', available: false })
      await engineer.save()

      const updates = { name: 'Huda K.', specialty: 'Interior', available: true }

      const res = await request(app)
        .put(`/api/engineers/${engineer._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(200)

      expect(res.body).toHaveProperty('name', updates.name)
      expect(res.body).toHaveProperty('specialty', updates.specialty)
      expect(res.body).toHaveProperty('available', true)
    })

    test('should handle checkbox in update', async () => {
      const engineer = new Engineer({ name: 'Omar', specialty: 'Mechanical', available: false })
      await engineer.save()

      const updates = { name: 'Omar', specialty: 'Mechanical', available: 'on' }

      const res = await request(app)
        .put(`/api/engineers/${engineer._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updates)
        .expect(200)

      expect(res.body).toHaveProperty('available', true)
    })
  })

  describe('DELETE /api/engineers/:id', () => {
    test('should delete engineer successfully', async () => {
      const engineer = new Engineer({ name: 'Mona', specialty: 'Civil', available: true })
      await engineer.save()

      const res = await request(app)
        .delete(`/api/engineers/${engineer._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body).toHaveProperty('message', 'Engineer successfully deleted')
      const deleted = await Engineer.findById(engineer._id)
      expect(deleted).toBeNull()
    })

    test('should return 401 without token', async () => {
      const engineer = new Engineer({ name: 'Khalid', specialty: 'Software', available: true })
      await engineer.save()

      const res = await request(app)
        .delete(`/api/engineers/${engineer._id}`)
        .expect(401)

      expect(res.text).toBe('Not authorized')
    })
  })
})
