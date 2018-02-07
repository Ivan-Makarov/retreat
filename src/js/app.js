'use strict';

import formHandler from '../includes/signup/signup';
import expandTextAreas from './textarea';
import slider from '../includes/sliding_gallery/sliding_gallery';
import map from '../includes/map/map';
import smoothScroll from './scroll'
import header from '../includes/header/header';

document.addEventListener('DOMContentLoaded', () => {
	formHandler('.signup')
})
document.addEventListener('DOMContentLoaded', slider);
document.addEventListener('DOMContentLoaded', expandTextAreas);
document.addEventListener('DOMContentLoaded', smoothScroll);
document.addEventListener('DOMContentLoaded', header);

map();
