export default () => {
	const menu = document.querySelector('.header__content');
	const btn = document.querySelector('.header-btn');
	const links = [...menu.querySelectorAll('a')];
	
	btn.addEventListener('click', toggleMenu)
	
	function toggleMenu(e) {
		e.preventDefault();
		isOpen(menu) ? close(menu) : open(menu)
	}

	function close(item) {
		item.style.display = "none"
	}

	function open(item) {
		item.style.display = "flex"
	}

	function isOpen(item) {
		return item.style.display === "flex"
	}

	links.forEach(link => {
		link.addEventListener('click', () => {
			if(window.innerWidth <= 750) {
				close(menu)
			} 	
		})
	})

	window.addEventListener('resize', adjustMenu)

	function adjustMenu() {
		window.innerWidth > 750 ? open(menu) : close(menu)
	}
}
