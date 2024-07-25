let globalImage = globalThis.Image;
let isErrorInsteadOfLoad: boolean;

class MockImage extends globalThis.Image {
	constructor() {
		super();
		// @ts-expect-error - Expected 1 arguments, but got 0.ts
		window.setTimeout(() => this[isErrorInsteadOfLoad ? 'onerror' : 'onload']?.());
	}
}

export function enableMockGlobalImage(isError: boolean = false) {
	globalThis.Image = MockImage;
	isErrorInsteadOfLoad = isError;
}

export function disableMockGlobalImage() {
	globalThis.Image = globalImage;
}
