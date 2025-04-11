import Fastify from 'fastify'
import supertest from 'supertest'

import sourceRecordRoutes from './source_record'
import { SourceRecordService } from '../services/source_record.service'

jest.mock('../services/source_record.service')

describe('Source Record Routes', () => {
  let app: ReturnType<typeof Fastify>

  beforeAll(async () => {
    app = Fastify()
    await app.register(sourceRecordRoutes)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should fetch a source record by ID', async () => {
    const mockSourceRecord = {
      id: '00000000-0000-0000-0000-000000000000',
      formId: '11111111-1111-1111-1111-111111111111',
      sourceData: [{ question: 'Test question', answer: 'Test answer' }],
    }
    jest
      .spyOn(SourceRecordService, 'getSourceRecordById')
      .mockResolvedValue(mockSourceRecord)

    const response = await supertest(app.server)
      .get('/00000000-0000-0000-0000-000000000000')
      .expect(200)

    expect(response.body).toEqual({
      data: mockSourceRecord,
      message: 'success',
      statusCode: 200,
    })
    expect(SourceRecordService.getSourceRecordById).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000'
    )
  })

  it('should return 404 if the source record is not found', async () => {
    jest
      .spyOn(SourceRecordService, 'getSourceRecordById')
      .mockRejectedValue(new Error('Source record not found'))

    const response = await supertest(app.server)
      .get('/00000000-0000-0000-0000-000000000000')
      .expect(404)

    expect(response.body).toHaveProperty(
      'message',
      'failed to fetch source record'
    )
    expect(SourceRecordService.getSourceRecordById).toHaveBeenCalledWith(
      '00000000-0000-0000-0000-000000000000'
    )
  })

  it('should create a new source record', async () => {
    const mockSourceRecord = {
      id: '00000000-0000-0000-0000-000000000000',
      formId: '11111111-1111-1111-1111-111111111111',
      sourceData: [{ question: 'Test question', answer: 'Test answer' }],
    }
    jest
      .spyOn(SourceRecordService, 'createSourceRecord')
      .mockResolvedValue(mockSourceRecord)

    const sourceRecordData = {
      formId: '11111111-1111-1111-1111-111111111111',
      sourceData: [{ question: 'Test question', answer: 'Test answer' }],
    }

    const response = await supertest(app.server)
      .post('')
      .send(sourceRecordData)
      .expect(201)

    expect(response.body).toEqual({
      data: mockSourceRecord,
      message: 'success',
      statusCode: 201,
    })
    expect(SourceRecordService.createSourceRecord).toHaveBeenCalledWith(
      '11111111-1111-1111-1111-111111111111',
      sourceRecordData.sourceData
    )
  })

  it('should return 400 if the request body is invalid', async () => {
    jest
      .spyOn(SourceRecordService, 'createSourceRecord')
      .mockRejectedValue(new Error('Invalid source record data'))

    const invalidSourceRecordData = {
      formId: '',
      sourceData: [],
    }

    const response = await supertest(app.server)
      .post('')
      .send(invalidSourceRecordData)
      .expect(400)

    expect(response.body).toHaveProperty(
      'message',
      'failed to create source record'
    )
    expect(SourceRecordService.createSourceRecord).toHaveBeenCalledWith('', [])
  })
})
