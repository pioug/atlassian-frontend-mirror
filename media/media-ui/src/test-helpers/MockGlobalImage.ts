declare var global: any;

let globalImage: any = global.Image;
let isErrorInsteadOfLoad: boolean;

class MockImage extends global.Image {
	constructor() {
		super();
		window.setTimeout(() => this[isErrorInsteadOfLoad ? 'onerror' : 'onload']());
	}
}

export function enableMockGlobalImage(isError: boolean = false): void {
	global.Image = MockImage;
	isErrorInsteadOfLoad = isError;
}

export function disableMockGlobalImage(): void {
	global.Image = globalImage;
}
