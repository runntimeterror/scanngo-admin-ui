// Router for Inframonitor Dashboard APIs, proxies requests to S3 backend
import express from 'express'
// import ensureLoggedIn from '../middlewares/ensure-logged-in.js'
const router = express.Router()

const createRouter = (uiRequestHandler) => {
  // router.use('/feedback', ensureLoggedIn)

  router.use('/', (req, res) => {
    uiRequestHandler(req, res)
  })

  return router
}

export default createRouter
