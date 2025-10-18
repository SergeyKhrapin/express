import delay from './delay.js'

export function getFetchUsersApi() {
	const controller = new AbortController()
	const { signal } = controller

	async function fetchUsers(token) {		
		try {
			await delay(1500)
			// const response = await fetch('/users/blablabla') // * 404
			const response = await fetch('/users', {
				headers: {
					Authorization: `Bearer ${token}`
				},
				signal
			})
			const { data } = await response.json()
			return data
		} catch(e) {
			// * Express recognizes 404 like an error. In fact, 404 is not an error, and catch block does not have to be executed
			// ** Also catch is executed when the request is aborted
			return new Error("Login is required");
		}
	}

	function abortFetching() {
		controller.abort()
		console.log('Fetch aborted')
	}

	return { fetchUsers, abortFetching }
}
