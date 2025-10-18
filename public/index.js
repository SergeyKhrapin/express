import { getFetchUsersApi } from './utils/getFetchUsersApi.js'
import { renderUsers, renderFetchErrorMessage } from './utils/handleUsersUI.js'
import { login } from './utils/login.js'
import { handleLoginUI } from './utils/handleLoginUI.js'

// addRouting()

let accessToken

const fetchButton = document.getElementById('fetch')
const abortButton = document.getElementById('abort')
const loginButton = document.getElementById('loginButton')
const loginForm = document.getElementById('loginForm')

const { fetchUsers, abortFetching } = getFetchUsersApi()

loginButton.addEventListener('click', () => {
	loginForm.style.display = 'flex'
})

loginForm.addEventListener('submit', async (e) => {
	accessToken = await login(loginForm, e)
	handleLoginUI(accessToken)
})

fetchButton.addEventListener('click', async () => {
	const result = await fetchUsers(accessToken)
	
	if (result instanceof Error) {
		renderFetchErrorMessage(result.message)
	} else {
		renderUsers(result)
	}
})

abortButton.addEventListener('click', abortFetching) // **
