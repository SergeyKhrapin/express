const express = require("express")
const app = express()
const access_token = '666'
const refresh_token = '777'

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const users = [
    { id: 1, firstName: 'Petro', lastName: 'Petrenko', age: 30 },
    { id: 2, firstName: 'Dmytro', lastName: 'Dmytrenko', age: 18 },
    { id: 3, firstName: 'Tom', lastName: 'Hanks', age: 65 },
]

app.get('/users', function (req, res) {
    const queryID = req.query.id
    const responseData = queryID ? users.filter(user => user.id.toString() === queryID) : users
    
    if (req.headers.authorization !== `Bearer ${access_token}`) {
        res.status(401).send('Access denied - authorization is required')
    }

    res.json({
        data: responseData
    })
})

app.post('/login', function (req, res) {
    const { email, password } = req.body

    if (email !== 'khrapins@gmail.com' || password !== '12345') {
        console.log('fail')
        res
            .status(401)
            .send('Wrong credentials')
    } else {
        res
            .cookie('refresh_token', refresh_token, {
                httpOnly: true
            })
            .json({
                access_token: access_token
            })
    }
})

app.listen(3000)
