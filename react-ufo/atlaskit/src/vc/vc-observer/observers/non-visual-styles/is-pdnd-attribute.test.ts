import isPdndAttribute, { PDND_REGISTRATION_ATTRIBUTES } from './is-pdnd-attribute';

// The predicate itself does not read any feature gate (the gate is consumed
// at the call site in viewport-observer). These tests verify the predicate
// logic in isolation.

describe('isPdndAttribute', () => {
	it('should return false when target is not an Element', () => {
		expect(isPdndAttribute({ target: null, attributeName: 'draggable' })).toBe(false);
		expect(isPdndAttribute({ target: undefined, attributeName: 'draggable' })).toBe(false);
	});

	it('should return false when attributeName is missing', () => {
		const element = document.createElement('div');

		expect(isPdndAttribute({ target: element, attributeName: null })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: undefined })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: '' })).toBe(false);
	});

	it('should return false for unrelated attributes', () => {
		const element = document.createElement('div');

		expect(isPdndAttribute({ target: element, attributeName: 'class' })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: 'style' })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: 'aria-label' })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: 'data-something' })).toBe(false);
	});

	describe('Pragmatic Drag and Drop registration attributes', () => {
		const element = document.createElement('div');

		// Sanity check: every attribute in the exported set is matched by the
		// predicate.
		it.each(Array.from(PDND_REGISTRATION_ATTRIBUTES))(
			'should return true for %s',
			(attributeName) => {
				expect(isPdndAttribute({ target: element, attributeName })).toBe(true);
			},
		);
	});

	describe('drop target attributes follow data-drop-target-for-* pattern', () => {
		const element = document.createElement('div');

		it.each([
			'data-drop-target-for-element',
			'data-drop-target-for-external',
			'data-drop-target-for-text-selection',
			// custom adapters built on make-adapter use arbitrary type keys
			'data-drop-target-for-something-custom',
		])('should return true for %s', (attributeName) => {
			expect(isPdndAttribute({ target: element, attributeName })).toBe(true);
		});

		it('should not match attributes that merely contain the prefix mid-string', () => {
			expect(
				isPdndAttribute({
					target: element,
					attributeName: 'aria-data-drop-target-for-element',
				}),
			).toBe(false);
		});
	});

	it('should not match other vendor data attributes', () => {
		const element = document.createElement('div');

		// Other product attributes that look similar but are unrelated.
		expect(isPdndAttribute({ target: element, attributeName: 'data-vc-nvs' })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: 'data-rbd' })).toBe(false);
		expect(isPdndAttribute({ target: element, attributeName: 'data-rbd-something-new' })).toBe(
			false,
		);
	});
});
