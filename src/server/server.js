// Entrypoint for Scan-N-Go Admin UI Application
// Uses express for proxy and health endpoints
//    forwards to nextjs handler for UI
import path from 'path'
const __dirname = path.resolve()
import createError from 'http-errors'
import express from 'express'
import nextjs from 'next'

// Routes Imports
// import authenticationRouter from './routes/authentication.js'
import createUIRouter from './routes/nextjs-ui.js'
// import certToolRouter from './routes/cert-tool-api.js'
// import feedbackToolRouter from './routes/feedback-tool-api.js'
// import infraRegistryHealthRouter from './routes/infra-registry-health-api.js'
// import proxyPagesRouter from './routes/proxy-pages.js'
// import health from './routes/helpers/health.js'

// Middleware Imports
// import visitorIdCookieMiddleware from './middlewares/visitorid-cookie-middleware.js'

// Dependency Imports
const dev = process.env.NODE_ENV !== 'production'
const hostname = '0.0.0.0'
const port = process.env.PORT || 3000
const app = nextjs({ dev, hostname, port })
const nextjsUIHandle = app.getRequestHandler()
const server = express()

app.prepare().then(() => {
  // server.use(cookieParser())
  // server.use(visitorIdCookieMiddleware)
  // server.use(argosClient.expressMiddleware)
  server.use(express.json())
  server.use(express.urlencoded({ extended: false }))
  server.use(express.static(path.join(__dirname, 'public')))

  /***********************/
  /**** setup routers ****/
  /***********************/
  // authentication
  // server.use(authenticationRouter)

  // server.use(ensureLoggedIn)

  // health endpoint
  // server.use('/health', health)

  // infra registry heatlh backend
  // server.use('/api/infra_registry_health', infraRegistryHealthRouter)

  // feedback tool backend
  // server.use('/api/feedback_tool', feedbackToolRouter)

  // server.use('/api/cert_tool', certToolRouter)

  // proxies to documentation
  // server.use('/', proxyPagesRouter);

  // use nextjs handler for non proxied routes
  server.use('/', createUIRouter(nextjsUIHandle))

  // catch 404 and forward to error handler
  server.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  server.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.send(err.message)
  })

  /***********************/
  /**** start server *****/
  /***********************/

  server.listen(port, () => {
    // logger.info(`Listening on ${hostname}:${port}`)
  })

})

export default server
