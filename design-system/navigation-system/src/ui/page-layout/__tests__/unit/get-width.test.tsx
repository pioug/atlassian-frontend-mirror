import { getPixelWidth } from '../../panel-splitter/get-width';

describe('getPixelWidth', () => {
	it('should return the offsetWidth of an element', () => {
		const element = document.createElement('div');
		element.style.width = '100px';

		// `getPixelWidth()` relies on the `offsetWidth`
		jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockImplementation(function (
			this: HTMLElement,
		) {
			return 100;
		});

		const result = getPixelWidth(element);

		expect(result).toEqual(100);
	});
});
