import { FastifyInstance } from 'fastify'

import { Form } from '@prisma/client'

import { ApiError, StatusCodes } from '../errors'
import { serializer } from './middleware/pre_serializer'
import { IEntityId } from './schemas/common'
import { ICreateFormRequest } from './schemas/form.types'
import { FormService } from '../services/form.service'

/**
 * Registers routes for managing forms.
 * @param {FastifyInstance} app - The Fastify instance to register the routes on.
 */
async function formRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer)

  const log = app.log.child({ component: 'formRoutes' })

  /**
   * @route GET /:id
   * @description Fetches a form by its ID.
   * @param {IEntityId} Params - The route parameters containing the form ID.
   * @returns {Form} The form object corresponding to the provided ID.
   * @throws {ApiError} If the form is not found or an error occurs.
   */
  app.get<{
    Params: IEntityId
    Reply: Form
  }>('/:id', {
    async handler(req, reply) {
      const { params } = req
      const { id } = params
      log.debug('get form by id')

      try {
        const form = await FormService.getFormById(id)
        reply.send(form)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to fetch form', StatusCodes.notFound)
      }
    },
  })

  /**
   * @route POST /
   * @description Creates a new form.
   * @param {ICreateFormRequest} Body - The request body containing the form name and fields.
   * @returns {Form} The newly created form object.
   * @throws {ApiError} If an error occurs while creating the form.
   */
  app.post<{
    Body: ICreateFormRequest
    Reply: Form
  }>('/', {
    async handler(req, reply) {
      const { body } = req
      const { name, fields } = body
      log.debug('create new form')

      try {
        const newForm = await FormService.createForm(name, fields)
        reply.status(StatusCodes.created).send(newForm)
      } catch (err: any) {
        log.error({ err }, err.message)
        throw new ApiError('failed to create form', StatusCodes.badRequest)
      }
    },
  })
}

export default formRoutes
