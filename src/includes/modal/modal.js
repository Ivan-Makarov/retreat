export default () => {
	const modalBtns = [...document.querySelectorAll('.js-modal')];
	const modal = document.querySelector('.modal');
	const body = document.querySelector('.body');

	modalBtns.forEach(btn => {
		btn.addEventListener('click', function(e) {
			e.preventDefault();
			modal.classList.remove('hidden');
			body.classList.add('noscroll');
		});
	});

	document.addEventListener('click', function(e) {	
		if (e.target.classList.contains('modal')) {
			e.preventDefault();
			e.target.classList.add('hidden');
			body.classList.remove('noscroll');
		}
	});
}
