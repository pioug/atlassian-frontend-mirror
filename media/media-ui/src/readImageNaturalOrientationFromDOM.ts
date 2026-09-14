export function readImageNaturalOrientationFromDOM(img: HTMLImageElement): {
	width: number;
	height: number;
} {
	img.style.position = 'absolute';
	img.style.visibility = 'hidden';
	document.body.appendChild(img);
	const { width, height } = img.getBoundingClientRect();
	document.body.removeChild(img);
	return { width, height };
}
