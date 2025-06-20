// @ts-nocheck
import $ from './dollar';

function getContainer() {
	// Look for these two selectors first... you need these to allow for the auto-shrink to work
	// Otherwise, it'll default to document.body which can't auto-grow or auto-shrink
	var container = $('.ac-content, #content');
	return container.length > 0 ? container[0] : document.body;
}

export default getContainer;
