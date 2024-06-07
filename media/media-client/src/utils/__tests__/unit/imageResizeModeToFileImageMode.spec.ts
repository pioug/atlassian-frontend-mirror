import {
	imageResizeModeToFileImageMode,
	type ImageResizeMode,
} from '../../imageResizeModeToFileImageMode';

describe('imageResizeModeToFileImageMode', () => {
	it('should return "full-fit" if input is "stretchy-fit"', () => {
		expect(imageResizeModeToFileImageMode('stretchy-fit')).toBe('full-fit');
	});
	it.each(['crop', 'fit', 'full-fit'] as ImageResizeMode[])(
		'should return the same input when it is %s',
		(mode) => {
			expect(imageResizeModeToFileImageMode(mode)).toBe(mode);
		},
	);
});
