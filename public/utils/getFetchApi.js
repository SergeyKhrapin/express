import delay from './delay.js'

export function getFetchApi() {
	const controller = new AbortController()
	const { signal } = controller

	async function fetchUsers() {
		try {
			await delay(3000)
			// const response = await fetch('/users/blablabla') // * 404
			const response = await fetch('/users', { signal })
			const { data } = await response.json()
			return data
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

	return { fetchUsers, abortFetching }
}
