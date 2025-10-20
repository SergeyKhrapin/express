const express = require("express")
const { static: staticExpress, urlencoded, json } = express
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser')
const data = require('./db.json')

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRARTION = 20
const REFRESH_TOKEN_EXPIRARTION = '7d'
const REQUESTS_AUTH_NOT_REQUIRED = ['/login', '/refresh']

const app = express()

app.use(staticExpress("public"))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cookieParser())

function issueTokens(payload) {
	const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRARTION })
	const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRARTION })

	return { access_token, refresh_token }
}

app.use((req, res, next) => {
	if (REQUESTS_AUTH_NOT_REQUIRED.includes(req.path)) {
		return next()
	}

	const errorStatusMap = {
		['jwt must be provided']: 401,
		['jwt expired']: 403,
	}
	
	const authHeader = req.headers.authorization
	const token = authHeader?.split('Bearer ')[1]	

	jwt.verify(token, ACCESS_TOKEN_SECRET, (err) => {		
		if (err) {
			// token is invalid or expired
			return res.status(errorStatusMap[err.message]).json({ error: err.message })
		}
		next()
	})
})

app.get('/users', function (req, res) {
	const queryID = req.query.id
	const responseData = queryID ? data?.users?.filter(user => user.id.toString() === queryID) : data?.users
	
	res.json({
		data: responseData
	})
})

app.post('/login', function (req, res) {
	const { email, password } = req.body

	const isValidUser = data?.registeredUsers?.some((user) => (
		email === user.email && password === user.password
	))

	if (isValidUser) {
		const payload = { email }
		const { access_token, refresh_token } = issueTokens(payload)

		res.cookie('refresh_token', refresh_token, { httpOnly: true }).json({	access_token })
	} else {
		res.status(401).json({ error: 'Wrong credentials' })
	}
})

app.get('/refresh', function (req, res) {
	const { refresh_token } = req.cookies

	jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, (err, decoded) => {		
		if (err) return res.status(403).json({ error: err.message }) // refresh token is invalid

		const { email } = decoded
		const payload = { email }

		// Issue new access and refresh tokens
		const { access_token, refresh_token } = issueTokens(payload)

		res
			.cookie('refresh_token', refresh_token, {
				httpOnly: true,
				sameSite: 'strict'
			})
			.json({	access_token })
	})
})

app.listen(3000)
