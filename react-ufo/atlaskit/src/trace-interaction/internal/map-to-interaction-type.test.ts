import mapToInteractionType from './map-to-interaction-type';

describe('mapToInteractionType', () => {
	describe('press interaction mapping', () => {
		it('should map click events to press interaction type', () => {
			const result = mapToInteractionType('click');
			expect(result).toBe('press');
		});

		it('should map dblclick events to press interaction type', () => {
			const result = mapToInteractionType('dblclick');
			expect(result).toBe('press');
		});

		it('should map mousedown events to press interaction type', () => {
			const result = mapToInteractionType('mousedown');
			expect(result).toBe('press');
		});
	});

	describe('hover interaction mapping', () => {
		it('should map mouseenter events to hover interaction type', () => {
			const result = mapToInteractionType('mouseenter');
			expect(result).toBe('hover');
		});

		it('should map mouseover events to hover interaction type', () => {
			const result = mapToInteractionType('mouseover');
			expect(result).toBe('hover');
		});
	});

	describe('unsupported event types', () => {
		it('should return undefined for keydown events', () => {
			const result = mapToInteractionType('keydown');
			expect(result).toBeUndefined();
		});

		it('should return undefined for keyup events', () => {
			const result = mapToInteractionType('keyup');
			expect(result).toBeUndefined();
		});

		it('should return undefined for mousemove events', () => {
			const result = mapToInteractionType('mousemove');
			expect(result).toBeUndefined();
		});

		it('should return undefined for scroll events', () => {
			const result = mapToInteractionType('scroll');
			expect(result).toBeUndefined();
		});

		it('should return undefined for focus events', () => {
			const result = mapToInteractionType('focus');
			expect(result).toBeUndefined();
		});

		it('should return undefined for blur events', () => {
			const result = mapToInteractionType('blur');
			expect(result).toBeUndefined();
		});

		it('should return undefined for submit events', () => {
			const result = mapToInteractionType('submit');
			expect(result).toBeUndefined();
		});

		it('should return undefined for input events', () => {
			const result = mapToInteractionType('input');
			expect(result).toBeUndefined();
		});

		it('should return undefined for change events', () => {
			const result = mapToInteractionType('change');
			expect(result).toBeUndefined();
		});
	});

	describe('edge cases', () => {
		it('should return undefined for empty string', () => {
			const result = mapToInteractionType('');
			expect(result).toBeUndefined();
		});

		it('should return undefined for whitespace string', () => {
			const result = mapToInteractionType('   ');
			expect(result).toBeUndefined();
		});

		it('should be case sensitive - CLICK should not match', () => {
			const result = mapToInteractionType('CLICK');
			expect(result).toBeUndefined();
		});

		it('should be case sensitive - Click should not match', () => {
			const result = mapToInteractionType('Click');
			expect(result).toBeUndefined();
		});

		it('should return undefined for partial matches', () => {
			const result = mapToInteractionType('clicking');
			expect(result).toBeUndefined();
		});

		it('should return undefined for null input', () => {
			const result = mapToInteractionType(null as any);
			expect(result).toBeUndefined();
		});

		it('should return undefined for undefined input', () => {
			const result = mapToInteractionType(undefined as any);
			expect(result).toBeUndefined();
		});
	});

	describe('comprehensive event type coverage', () => {
		// Test all supported press events
		const pressEvents = ['click', 'dblclick', 'mousedown'];
		pressEvents.forEach((eventType) => {
			it(`should map ${eventType} to press`, () => {
				expect(mapToInteractionType(eventType)).toBe('press');
			});
		});

		// Test all supported hover events
		const hoverEvents = ['mouseenter', 'mouseover'];
		hoverEvents.forEach((eventType) => {
			it(`should map ${eventType} to hover`, () => {
				expect(mapToInteractionType(eventType)).toBe('hover');
			});
		});

		// Test a variety of unsupported events
		const unsupportedEvents = [
			'mouseout',
			'mouseleave',
			'mouseup',
			'mousemove',
			'keydown',
			'keyup',
			'keypress',
			'focus',
			'blur',
			'focusin',
			'focusout',
			'input',
			'change',
			'submit',
			'reset',
			'load',
			'unload',
			'beforeunload',
			'resize',
			'scroll',
			'touchstart',
			'touchend',
			'touchmove',
			'touchcancel',
			'dragstart',
			'drag',
			'dragend',
			'drop',
			'copy',
			'cut',
			'paste',
			'wheel',
			'contextmenu',
		];

		unsupportedEvents.forEach((eventType) => {
			it(`should return undefined for ${eventType}`, () => {
				expect(mapToInteractionType(eventType)).toBeUndefined();
			});
		});
	});
});
