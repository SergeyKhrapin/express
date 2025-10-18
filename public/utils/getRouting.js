import { pagesConfig } from "../modules/pagesConfig.js"

export function addRouting() {
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
