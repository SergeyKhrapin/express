const express = require("express")
const app = express()

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

    res.json({
        data: responseData
    })
})

app.listen(3000)
