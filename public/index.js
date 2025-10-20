import { renderUsers, renderFetchErrorMessage } from './utils/ui/handleUsersUI.js'
import { login } from './utils/fetch/login.js'
import { handleLoginUI } from './utils/ui/handleLoginUI.js'
import { fetchWithRefresh } from './utils/fetch/fetchWithRefresh.js'
import delay from './utils/delay.js'

// addRouting()

export let tokens = {
	accessToken: null,
	csrfToken: null
}

const fetchButton = document.getElementById('fetch')
// const abortButton = document.getElementById('abort')
const loginButton = document.getElementById('loginButton')
const loginForm = document.getElementById('loginForm')

window.addEventListener('load', async () => {
	const response = await fetch('/refresh')
	const { accessToken, csrfToken, ...rest } = await response.json()
	tokens = { accessToken, csrfToken }
})

loginButton.addEventListener('click', () => {
	loginForm.style.display = 'flex'
})

loginForm.addEventListener('submit', async (e) => {
	const { accessToken, csrfToken, ...rest } = await login(loginForm, e)
	tokens = { accessToken, csrfToken }
	handleLoginUI(tokens.accessToken)
})

fetchButton.addEventListener('click', async () => {
	fetchWithRefresh(
		'/users',
		async () => {
			await delay(1500)
		},
		(data) => {
			// TODO: fix - it doesn't execute after refreshing token
			if (data?.error) {
				renderFetchErrorMessage('Login is required')
			} else if (data) {
				renderUsers(data)
			}
		},
	)
})

// abortButton.addEventListener('click', abortFetching) // **
