import {
	dialogFade,
	dialogMotion,
	dialogSlideUpAndFade,
	fade,
	popupMotion,
	scaleAndFade,
	slideAndFade,
} from '@atlaskit/top-layer/animations';

describe('animation presets', () => {
	describe('popupMotion()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = popupMotion();
			expect(preset.name).toBe('motion');
			expect(typeof preset.getStyles).toBe('function');
		});
	});

	describe('slideAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = slideAndFade();
			expect(preset.name).toBe('slide-and-fade');
			expect(typeof preset.getStyles).toBe('function');
		});

		it('returns directional custom properties per placement', () => {
			const preset = slideAndFade();
			expect(preset.getStyles).toBeDefined();

			expect(preset.getStyles?.({ placement: { axis: 'block', edge: 'end' } })).toEqual([
				{ property: '--ds-popover-tx', value: '0' },
				{ property: '--ds-popover-ty', value: '-4px' },
			]);
			expect(preset.getStyles?.({ placement: { axis: 'block', edge: 'start' } })).toEqual([
				{ property: '--ds-popover-tx', value: '0' },
				{ property: '--ds-popover-ty', value: '4px' },
			]);
			expect(preset.getStyles?.({ placement: { axis: 'inline', edge: 'end' } })).toEqual([
				{ property: '--ds-popover-tx', value: '-4px' },
				{ property: '--ds-popover-ty', value: '0' },
			]);
			expect(preset.getStyles?.({ placement: { axis: 'inline', edge: 'start' } })).toEqual([
				{ property: '--ds-popover-tx', value: '4px' },
				{ property: '--ds-popover-ty', value: '0' },
			]);
		});

		it('applies a custom slide distance to the custom properties', () => {
			const preset = slideAndFade({ distance: 8 });
			expect(preset.getStyles?.({ placement: { axis: 'block', edge: 'end' } })).toEqual([
				{ property: '--ds-popover-tx', value: '0' },
				{ property: '--ds-popover-ty', value: '-8px' },
			]);
		});
	});

	describe('fade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = fade();
			expect(preset.name).toBe('fade');
			expect(preset.getStyles).toBeUndefined();
		});
	});

	describe('scaleAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = scaleAndFade();
			expect(preset.name).toBe('scale-and-fade');
			expect(preset.getStyles).toBeUndefined();
		});
	});

	describe('dialogMotion()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogMotion();
			expect(preset.name).toBe('motion');
			expect(preset.getStyles).toBeUndefined();
		});
	});

	describe('dialogSlideUpAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.name).toBe('slide-up-and-fade');
		});

		it('exposes the default slide distance via a custom property', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.getStyles?.({ placement: {} })).toEqual([
				{ property: '--ds-dialog-ty', value: '12px' },
			]);
		});

		it('exposes a custom slide distance via a custom property', () => {
			const preset = dialogSlideUpAndFade({ distance: 20 });
			expect(preset.getStyles?.({ placement: {} })).toEqual([
				{ property: '--ds-dialog-ty', value: '20px' },
			]);
			// The name stays stable across distances because the distance is
			// now driven by a custom property rather than baked into the styles.
			expect(preset.name).toBe('slide-up-and-fade');
		});
	});

	describe('dialogFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogFade();
			expect(preset.name).toBe('fade');
			expect(preset.getStyles).toBeUndefined();
		});
	});
});
