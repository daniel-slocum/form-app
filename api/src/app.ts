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
    openapi: {
      info: {
        title: 'Form App',
        version: '1.0.0',
      },
    },
    refResolver: {
      buildLocalReference(json, baseUri, fragment, i) {
        return typeof json.$id === 'string' ? json.$id : `def-${i}`
      },
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
