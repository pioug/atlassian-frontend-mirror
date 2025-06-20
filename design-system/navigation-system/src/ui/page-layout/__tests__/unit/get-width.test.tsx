import { getPixelWidth } from '../../panel-splitter/get-width';

describe('getPixelWidth', () => {
	it('should return the computed width of an element in pixels', () => {
		const element = document.createElement('div');
		element.style.width = '100px';

		const result = getPixelWidth(element);

		expect(result).toEqual(100);
	});
});
