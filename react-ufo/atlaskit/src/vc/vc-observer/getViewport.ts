export function getViewportWidth(document = window.document) {
	let documentWidth;
	try {
		documentWidth = document.documentElement.clientWidth || 0;
	} catch (e) {
		documentWidth = 0;
	}
	return Math.max(documentWidth, window.innerWidth || 0);
}

export function getViewportHeight(document = window.document) {
	let documentHeight;
	try {
		documentHeight = document.documentElement.clientHeight || 0;
	} catch (e) {
		documentHeight = 0;
	}
	return Math.max(documentHeight, window.innerHeight || 0);
}
