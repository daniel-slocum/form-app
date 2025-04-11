import { FastifyInstance } from 'fastify'

import { SourceRecord } from '@prisma/client'

import { ApiError, StatusCodes } from '../errors'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ICreateSourceRecordRequest } from './schemas/source_record.types'
import { SourceRecordService } from '../services/source_record.service'

/**
 * Registers routes for managing source records.
 * @param {FastifyInstance} app - The Fastify instance to register the routes on.
 */
async function sourceRecordRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'sourceRecordRoutes' })

  /**
   * @route GET /:id
   * @description Fetches a source record by its ID.
   * @param {IEntityId} Params - The route parameters containing the source record ID.
   * @returns {SourceRecord} The source record object corresponding to the provided ID.
   * @throws {ApiError} If the source record is not found or an error occurs.
   */
  app.get<{
    Params: IEntityId
    Reply: SourceRecord
  }>('/:id', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get source record by id')

      try {
        const sourceRecord = await SourceRecordService.getSourceRecordById(id)
        reply.send(sourceRecord)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError(
          'failed to fetch source record',
          StatusCodes.notFound
        )
      }
    },
  })

  /**
   * @route POST /
   * @description Creates a new source record.
   * @param {ICreateSourceRecordRequest} Body - The request body containing the form ID and source data.
   * @returns {SourceRecord} The newly created source record object.
   * @throws {ApiError} If an error occurs while creating the source record.
   */
  app.post<{
    Body: ICreateSourceRecordRequest
    Reply: SourceRecord
  }>('/', {
    async handler(req, reply) {
      const { body } = req
      const { formId, sourceData } = body
      log.debug('create new source record')

      try {
        const newSourceRecord = await SourceRecordService.createSourceRecord(
          formId,
          sourceData
        )
        reply.status(StatusCodes.created).send(newSourceRecord)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError(
          'failed to create source record',
          StatusCodes.badRequest
        )
      }
    },
  })
}

export default sourceRecordRoutes
