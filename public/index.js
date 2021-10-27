import users from './modules/fetchUsers.js'
import sthFromModule1 from './modules/module1.js'
import sthFromModule2 from './modules/module2.js'
import delay from './utils/delay.js'

function displayUsers() {
	console.log('users', users)
}

displayUsers()

const usersSection = document.getElementById('users')
const fetchButton = document.getElementById('fetch')
const abortButton = document.getElementById('abort')

const controller = new AbortController()
const { signal } = controller

fetchButton.addEventListener('click', fetchUsers)
abortButton.addEventListener('click', abortFetching) // **

async function fetchUsers() {
	try {
		await delay(3000)
		// const response = await fetch('/users/blablabla') // * 404
		const response = await fetch('/users', { signal })
		const { data } = await response.json()
		const userList = document.createElement('ul')

		data.map(user => {
				const userItem = document.createElement('li')
				userItem.innerText = user.firstName + ' ' + user.lastName
				userList.append(userItem)
		})

		// TODO: to improve a performance (reflow/repaint)
		fetchButton.remove()
		usersSection.append(userList)
	} catch(e) {
		// * Express recognizes 404 like an error. In fact, 404 is not an error, and catch block does not have to be executed
		// ** Also catch is executed when the request is aborted
		console.log('CATCH', e)
	}
}

function abortFetching() {
	controller.abort()
	console.log('Fetch aborted')
}
