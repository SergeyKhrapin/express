const express = require("express")
const { static: staticExpress, urlencoded, json } = express
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser')
const data = require('./db.json')
const crypto = require('crypto')

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const ACCESS_TOKEN_EXPIRARTION = 20
const REFRESH_TOKEN_EXPIRARTION = '7d'
const REQUESTS_AUTH_NOT_REQUIRED = [
	'/login',
	'/refresh',
	'/proxy',
	'/service-worker.js',
	'/conversation-eventSource',
	'conversation-post'
]

const app = express()

app.use(staticExpress("public"))
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(cookieParser())

function issueTokensAndHandleResponse(res, payload) {
	const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRARTION })
	const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRARTION })
	const csrfToken = crypto.randomBytes(32).toString("hex")

	res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
	res.cookie('csrfToken', csrfToken, { httpOnly: true, sameSite: 'strict' })
	res.json({ accessToken, csrfToken })
}

app.use((req, res, next) => {
	if (REQUESTS_AUTH_NOT_REQUIRED.includes(req.path)) {
		return next()
	}

	const errorStatusMap = {
		['jwt must be provided']: 401,
		['jwt expired']: 403,
	}
	
	const csrfTokenHeader = req.get('X-CSRF-Token')
  const csrfTokenCookie = req.cookies.csrfToken

	// verify CSRF token
  if (!csrfTokenHeader || !csrfTokenCookie || csrfTokenHeader !== csrfTokenCookie) {		
		res.status(401).json({ error: 'Authorization is required' })
		next()
	}

	const accessToken = req.get('authorization')?.split('Bearer ')[1]
	
	// verify access token
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err) => {
		if (err) {
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
		issueTokensAndHandleResponse(res, payload)
	} else {
		res.status(401).json({ error: 'Wrong credentials' })
	}
})

app.get('/refresh', function (req, res) {
	const refreshToken = req.cookies.refreshToken

	jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {		
		if (err) return res.status(403).json({ error: err.message }) // refresh token is invalid

		const { email } = decoded
		const payload = { email }

		// Issue new tokens
		issueTokensAndHandleResponse(res, payload)
	})
})

// SSE - START

function handleSSE(req, res) {
	res.set('Content-Type', 'text/event-stream')
	res.set("Cache-Control", "no-cache");
  res.set("Connection", "keep-alive");
  res.flushHeaders();

	const text = "Here is an answer from AI chat"
	const textArray = text.split(' ')
  let i = 0

  const interval = setInterval(() => {
    if (i < textArray.length) {
      res.write(`data: ${JSON.stringify({ chunk: textArray[i] })}\n\n`)
      i++
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`)
      clearInterval(interval)
      res.end()
    }
  }, 500)

  req.on("close", () => {
    console.log("Client disconnected")
    clearInterval(interval)
    res.end()
  });
}

app.get('/conversation-eventSource', handleSSE) // EventSource SSE
app.post('/conversation-post', handleSSE) // POST-based SSE

// SSE - END

// Allow to make cross-origin requests to target url
app.get('/proxy', async (req, res) => {
	const target = req.query.url;

  if (!target) {
		return res.status(400).send('Missing ?url param')
	};
	
  const response = await fetch(target)
	const contentType = response.headers.get('content-type')
	
  res.set('Access-Control-Allow-Origin', '*')
	res.set('Content-Type', contentType)

	if (contentType.includes('application/json')) {
      const jsonData = JSON.parse(Buffer.from(response.data).toString('utf-8'));
      res.json(jsonData);
    } 
    // Handle text
    else if (contentType.startsWith('text/')) {
      res.send(Buffer.from(response.data).toString('utf-8'));
    } 
    // Handle binary (image, video, etc.)
    else {
			res.send(response.data)
    }
});

app.listen(3000)
