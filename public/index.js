import { getFetchApi } from './utils/getFetchApi.js'
import { renderUsers } from './utils/renderUsers.js'
import { login } from './utils/login.js'
import { handleLoginUI } from './utils/handleLoginUI.js'

// addRouting()

const fetchButton = document.getElementById('fetch')
const abortButton = document.getElementById('abort')
const loginButton = document.getElementById('loginButton')
const loginForm = document.getElementById('loginForm')

const { fetchUsers, abortFetching } = getFetchApi()

loginButton.addEventListener('click', () => {
	loginForm.style.display = 'flex'
})

loginForm.addEventListener('submit', async (e) => {
	const access_token = await login(loginForm, e)
	handleLoginUI(access_token)
})

fetchButton.addEventListener('click', async () => {
	const data = await fetchUsers()
	renderUsers(data)
})

abortButton.addEventListener('click', abortFetching) // **
