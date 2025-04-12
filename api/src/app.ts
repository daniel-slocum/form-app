import fastify from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

import errorHandler from './errors'
import formRoutes from './routes/form'
import sourceRecordRoutes from './routes/source_record'
import { FormSchema } from './routes/schemas/form.schemas'
import {
  SourceDataSchema,
  SourceRecordSchema,
} from './routes/schemas/source_record.schemas'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(swagger, {
    swagger: {
      info: {
        title: 'API Documentation',
        description: 'API documentation for the Form App',
        version: '1.0.0',
      },
      host: 'localhost:8080',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })

  app.register(swaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
    transformStaticCSP: header => header,
  })

  app.addSchema(FormSchema)
  app.addSchema(SourceDataSchema)
  app.addSchema(SourceRecordSchema)

  app.register(formRoutes, { prefix: '/forms' })
  app.register(sourceRecordRoutes, { prefix: '/source-records' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
