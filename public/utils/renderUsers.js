export function renderUsers(users) {
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
