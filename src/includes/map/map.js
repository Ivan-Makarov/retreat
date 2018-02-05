import data from '../../../data'

export default () => {
	ymaps.ready(init);
	let myMap,
		myPlacemark;

	const CENTER = data.map.center;
	const MARKER = data.map.marker;
	const MARKER_TEXT = data.map.markerText

	function init() {     
		myMap = new ymaps.Map("map", {
			center: CENTER,
			zoom: 11,
			controls: [
				"zoomControl",
				"fullscreenControl"
			]
		});

		myPlacemark = new ymaps.Placemark(MARKER, {
			content: MARKER_TEXT,
			iconContent: MARKER_TEXT
		}, {
			preset: 'islands#redStretchyIcon'
		});
		
	   myMap.geoObjects.add(myPlacemark);
	}
}
