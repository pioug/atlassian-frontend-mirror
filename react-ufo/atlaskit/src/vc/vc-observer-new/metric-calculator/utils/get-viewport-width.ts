export default function getViewportWidth(document = window.document) {
	let documentWidth;
	try {
		documentWidth = document.documentElement.clientWidth || 0;
	} catch (e) {
		documentWidth = 0;
	}
	return Math.max(documentWidth, window.innerWidth || 0);
}
