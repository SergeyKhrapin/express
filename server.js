const express = require("express")
const { static: staticExpress, urlencoded, json } = express
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser')

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

const users = [
	{ id: 1, firstName: 'Petro', lastName: 'Petrenko', age: 30 },
	{ id: 2, firstName: 'Dmytro', lastName: 'Dmytrenko', age: 18 },
	{ id: 3, firstName: 'Tom', lastName: 'Hanks', age: 65 },
]

app.get('/users', function (req, res) {
	const queryID = req.query.id
	const responseData = queryID ? users.filter(user => user.id.toString() === queryID) : users
	
	res.json({
		data: responseData
	})
})

app.post('/login', function (req, res) {
	const { email, password } = req.body

	if (email !== 'khrapins@gmail.com' || password !== '12345') {
		res
			.status(401)
			.json({ error: 'Wrong credentials' })
	} else {
		const payload = { email }
		const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRARTION })
		const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRARTION })

		res
			.cookie('refresh_token', refresh_token, {
				httpOnly: true
			})
			.json({	access_token })
	}
})

app.get('/refresh', function (req, res) {
	const { refresh_token } = req.cookies

	jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, (err, decoded) => {		
		if (err) return res.status(403).json({ error: err.message }) // refresh token is invalid

		const { email } = decoded
		const payload = { email }

		// Issue new access and refresh tokens
		const access_token = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRARTION })
		const refresh_token = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRARTION })

		res
			.cookie('refresh_token', refresh_token, {
				httpOnly: true
			})
			.json({	access_token })
	})
})

app.listen(3000)
