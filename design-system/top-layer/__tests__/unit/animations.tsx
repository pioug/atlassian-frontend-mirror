import {
	dialogFade,
	dialogSlideUpAndFade,
	fade,
	scaleAndFade,
	slideAndFade,
} from '../../src/animations/presets';

describe('animation presets', () => {
	describe('slideAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = slideAndFade();
			expect(preset.name).toBe('slide-and-fade');
			expect(preset.css).toContain('[data-ds-popover-slide-and-fade]');
			expect(preset.exitDurationMs).toBe(175);
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

		it('uses a custom distance when provided', () => {
			const preset = slideAndFade({ distance: 8 });
			expect(preset.getProperties).toBeDefined();

			expect(preset.getProperties?.({ placement: { axis: 'block', edge: 'end' } })).toEqual({
				'--ds-popover-tx': '0',
				'--ds-popover-ty': '-8px',
			});
		});

		it('includes reduced motion media query', () => {
			const preset = slideAndFade();
			expect(preset.css).toContain('prefers-reduced-motion');
		});
	});

	describe('fade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = fade();
			expect(preset.name).toBe('fade');
			expect(preset.css).toContain('[data-ds-popover-fade]');
			expect(preset.exitDurationMs).toBe(175);
			expect(preset.getProperties).toBeUndefined();
		});

		it('includes reduced motion media query', () => {
			const preset = fade();
			expect(preset.css).toContain('prefers-reduced-motion');
		});
	});

	describe('scaleAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = scaleAndFade();
			expect(preset.name).toBe('scale-and-fade');
			expect(preset.css).toContain('[data-ds-popover-scale-and-fade]');
			expect(preset.exitDurationMs).toBe(175);
			expect(preset.getProperties).toBeUndefined();
		});

		it('includes reduced motion media query', () => {
			const preset = scaleAndFade();
			expect(preset.css).toContain('prefers-reduced-motion');
		});
	});

	describe('dialogSlideUpAndFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.name).toBe('dialog-slide-up-and-fade');
			expect(preset.css).toContain('[data-ds-dialog-slide-up-and-fade]');
			expect(preset.exitDurationMs).toBe(175);
		});

		it('includes backdrop animation', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.css).toContain('::backdrop');
		});

		it('uses custom distance when provided', () => {
			const preset = dialogSlideUpAndFade({ distance: 20 });
			expect(preset.css).toContain('20px');
			expect(preset.css).not.toContain('12px');
		});

		it('includes reduced motion media query', () => {
			const preset = dialogSlideUpAndFade();
			expect(preset.css).toContain('prefers-reduced-motion');
		});
	});

	describe('dialogFade()', () => {
		it('returns a preset with the correct shape', () => {
			const preset = dialogFade();
			expect(preset.name).toBe('dialog-fade');
			expect(preset.css).toContain('[data-ds-dialog-fade]');
			expect(preset.exitDurationMs).toBe(175);
		});

		it('includes backdrop animation', () => {
			const preset = dialogFade();
			expect(preset.css).toContain('::backdrop');
		});

		it('includes reduced motion media query', () => {
			const preset = dialogFade();
			expect(preset.css).toContain('prefers-reduced-motion');
		});
	});
});
