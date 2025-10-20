import delay from '../delay.js'
import { fetchWithRefresh } from './fetchWithRefresh.js'

export function getFetchUsersApi() {
	const controller = new AbortController()
	const { signal } = controller

	async function fetchUsers(token) {	
		try {
			await delay(1500)

			const data = await fetchWithRefresh(async (jwt) => {
				return await fetch('/users', {
					headers: token ? {
						Authorization: `Bearer ${jwt}`
					} : {},
					signal
				})
			}, token)

			return data
		} catch(e) {
			// * Express recognizes 404 like an error. In fact, 404 is not an error, and catch block does not have to be executed
			// ** Also catch is executed when the request is aborted
			return new Error("");
		}
	}

	function abortFetching() {
		controller.abort()
		console.log('Fetch aborted')
	}

	return { fetchUsers, abortFetching }
}
