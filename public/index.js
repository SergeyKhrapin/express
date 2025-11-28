import { renderUsers, renderFetchErrorMessage } from './utils/ui/handleUsersUI.js'
import { login } from './utils/fetch/login.js'
import { handleLoginUI } from './utils/ui/handleLoginUI.js'
import { fetchWithRefresh } from './utils/fetch/fetchWithRefresh.js'
import delay from './utils/delay.js'
import objFromModule1 from './modules/module1.js'
import objFromModule2 from './modules/module2.js'

console.log('objFromModule1', objFromModule1);
console.log('objFromModule2', objFromModule2);

// addRouting()

export let tokens = {
	accessToken: null,
	csrfToken: null
}

const fetchButton = document.getElementById('fetch')
// const abortButton = document.getElementById('abort')
const loginButton = document.getElementById('loginButton')
const loginForm = document.getElementById('loginForm')

fetchWithRefresh('/proxy?url=https://placehold.jp/150x150.png').then(res => {
	// console.log('>>>>>', res);
})

window.addEventListener('load', async () => {
	const response = await fetch('/refresh')
	const { accessToken, csrfToken } = await response.json()
	tokens = { accessToken, csrfToken }
})

loginButton.addEventListener('click', () => {
	loginForm.style.display = 'flex'
})

loginForm.addEventListener('submit', async (e) => {
	const { accessToken, csrfToken } = await login(loginForm, e)
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

function registerServiceWorker(path) {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register(path)
			.then((data) => {
				console.log('SW registered', data)
			})
			.catch(console.error)
	}
}

registerServiceWorker('/service-worker.js')
