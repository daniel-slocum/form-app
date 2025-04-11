import Fastify from 'fastify'
import supertest from 'supertest'

import formRoutes from './form'
import { FormService } from '../services/form.service'

jest.mock('../services/form.service')

describe('Form Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeAll(async () => {
    app = Fastify()
    await app.register(formRoutes)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should fetch a form by ID', async () => {
    const mockForm = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Form',
      fields: {
        'field-1': {
          type: 'text',
          question: 'Test question',
          required: true,
        },
      },
    }
    jest.spyOn(FormService, 'getFormById').mockResolvedValue(mockForm)

    const response = await supertest(app.server)
      .get('/00000000-0000-0000-0000-000000000000')
      .expect(200)

    expect(response.body).toEqual({
      data: mockForm,
      message: 'success',
      statusCode: 200,
    })
    expect(FormService.getFormById).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000'
    )
  })

  it('should return 404 if the form is not found', async () => {
    jest
      .spyOn(FormService, 'getFormById')
      .mockRejectedValue(new Error('Form not found'))

    const response = await supertest(app.server)
      .get('/00000000-0000-0000-0000-000000000000')
      .expect(404)

    expect(response.body).toHaveProperty('message', 'failed to fetch form')
    expect(FormService.getFormById).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000'
    )
  })

  it('should create a new form', async () => {
    const mockForm = {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'New Test Form',
      fields: {
        'field-1': {
          type: 'text',
          question: 'New test question',
          required: true,
        },
      },
    }
    jest.spyOn(FormService, 'createForm').mockResolvedValue(mockForm)

    const formData = {
      name: 'New Test Form',
      fields: {
        'field-1': {
          type: 'text',
          question: 'New test question',
          required: true,
        },
      },
    }

    const response = await supertest(app.server)
      .post('')
      .send(formData)
      .expect(201)

    expect(response.body).toEqual({
      data: mockForm,
      message: 'success',
      statusCode: 201,
    })
    expect(FormService.createForm).toHaveBeenCalledWith(
      'New Test Form',
      formData.fields
    )
  })

  it('should return 400 if the request body is invalid', async () => {
    jest
      .spyOn(FormService, 'createForm')
      .mockRejectedValue(new Error('Invalid form data'))

    const invalidFormData = {
      name: '',
      fields: {},
    }

    const response = await supertest(app.server)
      .post('')
      .send(invalidFormData)
      .expect(400)

    expect(response.body).toHaveProperty('message', 'failed to create form')
    expect(FormService.createForm).toHaveBeenCalledWith('', {})
  })
})
