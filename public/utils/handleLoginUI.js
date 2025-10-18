import delay from './delay.js'

export async function handleLoginUI(access_token) {
  const fetchButton = document.getElementById('fetch')
  const abortButton = document.getElementById('abort')
  const loginForm = document.getElementById('loginForm')
  const correctCredentials = document.getElementById('correctCredentials')
  const errorCredentials = document.getElementById('errorCredentials')

  errorCredentials.style.display = 'none'

  if (access_token) {
    correctCredentials.style.display = 'block'
    await delay(1500)
    abortButton.disabled = false
    fetchButton.disabled = false
    loginForm.style.display = 'none'
  } else {
    errorCredentials.style.display = 'block'
  }
}
