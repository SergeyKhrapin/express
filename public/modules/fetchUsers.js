import delay from '../utils/delay.js'

// just to add some delay before a response
await delay(2000)

const users = fetch('/users').then(data => data.json())

console.log('Users have been fetched')

export default await users
