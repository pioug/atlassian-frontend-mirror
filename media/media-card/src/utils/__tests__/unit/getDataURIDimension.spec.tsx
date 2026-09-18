jest.mock('../../isRetina');
jest.mock('../../getElementDimension');
import { getDataURIDimension } from '../../getDataURIDimension';
import { getElementDimension } from '../../getElementDimension';
import { getRequestedDimensions } from '../../getRequestedDimensions';
import { isRetina } from '../../isRetina';

describe('getDataURIDimension()', () => {
	it('resolves both requested dimensions through the shared dimension helper', () => {
		jest.mocked(isRetina).mockReturnValue(false);
		expect(getRequestedDimensions({ dimensions: { width: 100, height: 50 } })).toEqual({
			width: 100,
			height: 50,
		});
	});

	it('should use passed dimensions', () => {
		const element = document.createElement('div');
		const dimensions = {
			width: 100,
			height: 50,
		};
		const width = getDataURIDimension('width', {
			element,
			dimensions,
		});
		const height = getDataURIDimension('height', {
			element,
			dimensions,
		});

		expect(width).toEqual(100);
		expect(height).toEqual(50);
	});

	it('should use default dimensions', () => {
		const element = document.createElement('div');
		const noAppearanceWidth = getDataURIDimension('width', {
			element,
		});
		const noAppearanceHeight = getDataURIDimension('height', {
			element,
		});

		expect(noAppearanceWidth).toEqual(156);
		expect(noAppearanceHeight).toEqual(125);
	});

	it('should use getElementDimension when dimension is percentage unit', () => {
		(getElementDimension as any).mockReturnValueOnce(50);
		const element = document.createElement('div');
		const width = getDataURIDimension('width', {
			element,
			dimensions: {
				width: '25%',
			},
		});
		expect(width).toEqual(50);
	});

	it('should return double size dimensions when is retina factor', () => {
		(isRetina as any).mockReturnValue(true);
		const element = document.createElement('div');

		const width = getDataURIDimension('width', {
			element,
			dimensions: {
				width: 10,
			},
		});
		const height = getDataURIDimension('height', {
			element,
			dimensions: {
				height: 20,
			},
		});

		expect(width).toEqual(20);
		expect(height).toEqual(40);
	});
});
