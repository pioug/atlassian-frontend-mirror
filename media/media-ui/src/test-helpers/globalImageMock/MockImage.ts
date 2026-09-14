import { globalImage } from './globalImage';
import { mockGlobalImageState } from './mockGlobalImageState';

export class MockImage extends globalImage {
	constructor() {
		super();
		window.setTimeout(() =>
			this[mockGlobalImageState.isErrorInsteadOfLoad ? 'onerror' : 'onload'](),
		);
	}
}
