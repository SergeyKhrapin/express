import delay from './utils/delay.js'
import { pagesConfig } from "./modules/pagesConfig.js"

function addRouting() {
	const links = document.getElementById('links');
	const sections = document.getElementsByClassName('section')
	
	function createLinks(config) {
		config.forEach(link => {
			let button = document.createElement('button');
			button.textContent = link.linkName;
			button.id = link.id;
	
			button.addEventListener('click', () => {
				window.history.pushState({activePage: link.id}, '', link.url);
				showPageContent();
			});
	
			links.append(button);
		});
	}
	
	links.addEventListener('click', (e) => {
		Array.from(e.target.parentElement.children).forEach(button => {
			button.disabled = button.id === history.state.activePage;
		});
	});
	
	function showPageContent() {
		Array.from(sections).forEach(section => {
			if (section.dataset.id === history.state.activePage) {
				section.style.display = "block";
			} else {
				section.style.display = "none";
			}
		});
	}
	
	createLinks(pagesConfig);
}

// addRouting();

const usersSection = document.getElementById('users')
const fetchButton = document.getElementById('fetch')
const abortButton = document.getElementById('abort')

const controller = new AbortController()
const { signal } = controller

fetchButton.addEventListener('click', async () => {
	const data = await fetchUsers()
	renderUsers(data)
})
abortButton.addEventListener('click', abortFetching) // **

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

function renderUsers(users) {
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

function abortFetching() {
	controller.abort()
	console.log('Fetch aborted')
}
