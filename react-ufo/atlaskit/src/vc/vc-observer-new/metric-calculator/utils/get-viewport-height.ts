export default function getViewportHeight(document = window.document) {
	let documentHeight;
	try {
		documentHeight = document.documentElement.clientHeight || 0;
	} catch (e) {
		documentHeight = 0;
	}
	return Math.max(documentHeight, window.innerHeight || 0);
}