import 'owl.carousel/dist/owl.carousel.js';

export default () => {
	$('.sliding-gallery__items').owlCarousel({
		loop: true,
		autoplay: true,
		autoplayHoverPause: true,
		autoplaySpeed: 1500,
		margin: 30,
		nav: true,
		dots: false,
		navContainer: '.sliding-gallery__nav',
		navText: ['', ''],
		responsive: {
			0: {
				items: 4
			}
		}
	})
}
