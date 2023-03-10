const express = require('express')
const createError = require('http-errors')
const path = require('path')
const cookieParser = require('cookie-parser')
const env = require('dotenv')
const cors = require('cors')

const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth.js')
const projectRouter = require('./routes/project.js')
const topicRouter = require('./routes/topic.js')
const { loggerMiddleware, logger } = require('./lib/utils/logger')
const db = require('./data')
const { Response } = require('./lib/utils')

// run configurations
logger.info('Running Configurations...')
env.config()
db.setupAndStart()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors()) // enable all cors request
app.use(loggerMiddleware())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/auth/', authRouter)
app.use('/api/topic/', topicRouter)
app.use('/api/project/', projectRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	if (err.status) res.json({ ok: false, message: 'endpoint not found' })
	else {
		logger.error(`Failed to read unapproved topics - failed with message - ${err.message}`)
		res.json(Response.fatal())
	}
})

module.exports = app
