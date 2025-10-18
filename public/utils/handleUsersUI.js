const fetchButton = document.getElementById('fetch')
const abortButton = document.getElementById('abort')

export function renderUsers(users) {
	console.log('users', users);
	
	const usersSection = document.getElementById('users')
	const userList = document.createElement('ul')

	users.map(user => {
			const userItem = document.createElement('li')
			userItem.innerText = user.firstName + ' ' + user.lastName
			userList.append(userItem)
	})

	// TODO: improve a performance (reflow/repaint)
	fetchButton.remove()
	abortButton.remove()
	usersSection.append(userList)
}

export function renderFetchErrorMessage(msg) {
	const errorMsg = document.getElementById('errorFetch')
	errorMsg.innerText = msg
}
