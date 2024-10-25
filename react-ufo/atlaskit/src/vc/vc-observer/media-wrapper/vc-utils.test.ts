import { isContainedWithinMediaWrapper } from './vc-utils';

describe('isContainedWithinMediaWrapper', () => {
	let wrapperElement: HTMLElement;
	let childElement: HTMLElement;
	let unrelatedElement: HTMLElement;

	beforeEach(() => {
		// Create a simple DOM structure for testing
		document.body.innerHTML = `
			<div id="wrapper" data-media-vc-wrapper>
				<div id="child"></div>
			</div>
			<div id="unrelated"></div>
		`;
		wrapperElement = document.getElementById('wrapper') as HTMLElement;
		childElement = document.getElementById('child') as HTMLElement;
		unrelatedElement = document.getElementById('unrelated') as HTMLElement;
	});

	it('should return true for an element with the data-media-vc-wrapper attribute', () => {
		expect(isContainedWithinMediaWrapper(wrapperElement)).toBe(true);
	});

	it('should return true for a child element of an element with the data-media-vc-wrapper attribute', () => {
		expect(isContainedWithinMediaWrapper(childElement)).toBe(true);
	});

	it('should return false for an element without the data-media-vc-wrapper attribute', () => {
		expect(isContainedWithinMediaWrapper(unrelatedElement)).toBe(false);
	});

	it('should return false for a null node', () => {
		expect(isContainedWithinMediaWrapper(null)).toBe(false);
	});
});
