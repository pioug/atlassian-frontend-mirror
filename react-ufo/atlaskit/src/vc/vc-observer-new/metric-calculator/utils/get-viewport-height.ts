function getViewportHeight(document: Document = window.document): number {
	let documentHeight;
	try {
		documentHeight = document.documentElement.clientHeight || 0;
	} catch {
		documentHeight = 0;
	}
	return Math.max(documentHeight, window.innerHeight || 0);
}

export default getViewportHeight;
