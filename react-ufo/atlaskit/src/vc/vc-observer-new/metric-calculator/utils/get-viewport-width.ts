function getViewportWidth(document: Document = window.document): number {
	let documentWidth;
	try {
		documentWidth = document.documentElement.clientWidth || 0;
	} catch {
		documentWidth = 0;
	}
	return Math.max(documentWidth, window.innerWidth || 0);
}

export default getViewportWidth;
