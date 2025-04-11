import fastify from 'fastify'

import errorHandler from './errors'
import formRoutes from './routes/form'
import sourceRecordRoutes from './routes/source_record'

function build(opts = {}) {
  const app = fastify(opts)

  app.register(formRoutes, { prefix: '/forms' })
  app.register(sourceRecordRoutes, { prefix: '/source-records' })

  app.setErrorHandler(errorHandler)

  return app
}
export default build
