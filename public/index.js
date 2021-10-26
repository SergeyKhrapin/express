const users = document.getElementById('users')
const button = document.getElementById('fetch')

button.addEventListener('click', fetchUsers)

async function fetchUsers() {
	try {
		await delay(3000)
		// const response = await fetch('/users/blablabla') // 404
		const response = await fetch('/users')
		const { data } = await response.json()
		const userList = document.createElement('ul')

		data.map(user => {
				const userItem = document.createElement('li')
				userItem.innerText = user.firstName + ' ' + user.lastName
				userList.append(userItem)
		})

		// TODO: to improve a performance (reflow/repaint)
		button.remove()
		users.append(userList)
	} catch(e) {
		// Express recognizes 404 like an error
		// In fact, 404 is not an error, and catch block does not have to be executed
		console.log('CATCH')
	}
}

async function delay(time) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	})
}
