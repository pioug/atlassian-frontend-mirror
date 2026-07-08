import {
	animationDurations,
	dialogFade,
	dialogMotion,
	dialogSlideUpAndFade,
	fade,
	popupMotion,
	scaleAndFade,
	slideAndFade,
} from '../../src/animations/presets';
describe('animation presets', () => {
	describe('popupMotion()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = popupMotion();
			expect(preset.name).toBe('popup-motion');
			expect(preset.enterDurationMs).toBe(animationDurations.popupMotion.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.popupMotion.exit);
			expect(typeof preset.getProperties).toBe('function');
		});
	});

	describe('slideAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = slideAndFade();
			expect(preset.name).toBe('slide-and-fade');
			expect(preset.enterDurationMs).toBe(animationDurations.popoverTransition.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.popoverTransition.exit);
			expect(typeof preset.getProperties).toBe('function');
		});

		it('returns directional custom properties per placement', () => {
			const preset = slideAndFade();
			expect(preset.getProperties).toBeDefined();

			expect(preset.getProperties?.({ placement: { axis: 'block', edge: 'end' } })).toEqual({
				'--ds-popover-tx': '0',
				'--ds-popover-ty': '-4px',
			});
			expect(preset.getProperties?.({ placement: { axis: 'block', edge: 'start' } })).toEqual({
				'--ds-popover-tx': '0',
				'--ds-popover-ty': '4px',
			});
			expect(preset.getProperties?.({ placement: { axis: 'inline', edge: 'end' } })).toEqual({
				'--ds-popover-tx': '-4px',
				'--ds-popover-ty': '0',
			});
			expect(preset.getProperties?.({ placement: { axis: 'inline', edge: 'start' } })).toEqual({
				'--ds-popover-tx': '4px',
				'--ds-popover-ty': '0',
			});
		});

		it('applies a custom slide distance to the custom properties', () => {
			const preset = slideAndFade({ distance: 8 });
			expect(preset.getProperties?.({ placement: { axis: 'block', edge: 'end' } })).toEqual({
				'--ds-popover-tx': '0',
				'--ds-popover-ty': '-8px',
			});
		});
	});

	describe('fade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = fade();
			expect(preset.name).toBe('fade');
			expect(preset.enterDurationMs).toBe(animationDurations.popoverTransition.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.popoverTransition.exit);
			expect(preset.getProperties).toBeUndefined();
		});
	});

	describe('scaleAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = scaleAndFade();
			expect(preset.name).toBe('scale-and-fade');
			expect(preset.enterDurationMs).toBe(animationDurations.popoverTransition.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.popoverTransition.exit);
			expect(preset.getProperties).toBeUndefined();
		});
	});

	describe('dialogMotion()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogMotion();
			expect(preset.name).toBe('motion');
			expect(preset.enterDurationMs).toBe(animationDurations.dialogMotion.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.dialogMotion.exit);
			expect(preset.getProperties).toBeUndefined();
		});
	});

	describe('dialogSlideUpAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.name).toBe('slide-up-and-fade');
			expect(preset.enterDurationMs).toBe(animationDurations.dialogTransition.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.dialogTransition.exit);
		});

		it('exposes the default slide distance via a custom property', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.getProperties?.({ placement: {} })).toEqual({
				'--ds-dialog-ty': '12px',
			});
		});

		it('exposes a custom slide distance via a custom property', () => {
			const preset = dialogSlideUpAndFade({ distance: 20 });
			expect(preset.getProperties?.({ placement: {} })).toEqual({
				'--ds-dialog-ty': '20px',
			});
			// The name stays stable across distances because the distance is
			// now driven by a custom property rather than baked into the styles.
			expect(preset.name).toBe('slide-up-and-fade');
		});
	});

	describe('dialogFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogFade();
			expect(preset.name).toBe('fade');
			expect(preset.enterDurationMs).toBe(animationDurations.dialogTransition.enter);
			expect(preset.exitDurationMs).toBe(animationDurations.dialogTransition.exit);
			expect(preset.getProperties).toBeUndefined();
		});
	});
});
