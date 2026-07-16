import { NATIVE_EMBED_PARAMETER_DEFAULTS } from '../constants';
import { getParameter, getParameters, setParameters } from '../utils';

describe('getParameter', () => {
	describe('isMaxWidth', () => {
		it('should return false when it is not stored in macroParams', () => {
			expect(getParameter(undefined, 'isMaxWidth')).toBe(false);
		});

		it('should return the stored value when explicitly set', () => {
			const params = setParameters({}, { isMaxWidth: true });
			expect(getParameter(params, 'isMaxWidth')).toBe(true);
		});
	});

	describe('aspectRatio', () => {
		it('should return NATIVE_EMBED_PARAMETER_DEFAULTS.aspectRatio when not in macroParams', () => {
			const params = setParameters({}, { url: 'https://example.com', width: 1200 });
			// aspectRatio not stored → falls back to default
			expect(getParameter(params, 'aspectRatio')).toBe(NATIVE_EMBED_PARAMETER_DEFAULTS.aspectRatio);
		});

		it('should return the stored aspectRatio when explicitly set', () => {
			const params = setParameters({}, { aspectRatio: 6 });
			expect(getParameter(params, 'aspectRatio')).toBe(6);
		});

		it('should correctly deserialize aspectRatio stored as a string value', () => {
			// setParameters serializes as { value: "6" }; getParameter must parse it back to a number
			const params = setParameters({}, { aspectRatio: 6 });
			const raw = (params as { macroParams?: Record<string, unknown> }).macroParams?.aspectRatio;
			expect(raw).toEqual({ value: '6' });
			expect(getParameter(params, 'aspectRatio')).toBe(6);
		});

		it('should handle fractional aspectRatio values', () => {
			const params = setParameters({}, { aspectRatio: 1.777 });
			// Stored as string and parsed back
			const result = getParameter(params, 'aspectRatio');
			expect(result).toBeCloseTo(1.777, 3);
		});

		it('should return undefined for parameters that are undefined', () => {
			expect(getParameter(undefined, 'aspectRatio')).toBe(
				NATIVE_EMBED_PARAMETER_DEFAULTS.aspectRatio,
			);
		});
	});
});

describe('getParameters (no key — returns all values)', () => {
	it('should include aspectRatio in the returned object', () => {
		const params = setParameters({}, { url: 'https://example.com', aspectRatio: 6 });
		const all = getParameters(params);
		expect(all).toHaveProperty('aspectRatio', 6);
	});

	it('should return the default aspectRatio when not explicitly stored', () => {
		const params = setParameters({}, { url: 'https://example.com' });
		const all = getParameters(params);
		expect(all).toHaveProperty('aspectRatio', NATIVE_EMBED_PARAMETER_DEFAULTS.aspectRatio);
	});

	it('should return all standard parameters alongside aspectRatio', () => {
		const params = setParameters({}, { url: 'https://example.com', width: 1200, aspectRatio: 6 });
		const all = getParameters(params);
		expect(all.url).toBe('https://example.com');
		expect(all.width).toBe(1200);
		expect(all.aspectRatio).toBe(6);
	});
});

describe('setParameters with aspectRatio', () => {
	it('should serialize aspectRatio into macroParams as a wrapped { value } string', () => {
		const params = setParameters({}, { aspectRatio: 6 });
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		expect(macroParams).toHaveProperty('aspectRatio', { value: '6' });
	});

	it('should not include aspectRatio in macroParams when not provided', () => {
		const params = setParameters({}, { url: 'https://example.com', width: 1200 });
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		expect(macroParams).not.toHaveProperty('aspectRatio');
	});

	it('should not serialize aspectRatio when value is undefined', () => {
		const params = setParameters({}, { url: 'https://example.com', aspectRatio: undefined });
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		expect(macroParams).not.toHaveProperty('aspectRatio');
	});

	it('should allow aspectRatio alongside other parameters', () => {
		const params = setParameters({}, { url: 'https://example.com', width: 1200, aspectRatio: 6 });
		expect(getParameter(params, 'url')).toBe('https://example.com');
		expect(getParameter(params, 'width')).toBe(1200);
		expect(getParameter(params, 'aspectRatio')).toBe(6);
	});

	it('should preserve existing macroParams when adding aspectRatio', () => {
		const initial = setParameters({}, { url: 'https://example.com', height: 600 });
		const updated = setParameters(initial, { aspectRatio: 6 });
		expect(getParameter(updated, 'url')).toBe('https://example.com');
		expect(getParameter(updated, 'height')).toBe(600);
		expect(getParameter(updated, 'aspectRatio')).toBe(6);
	});
});

describe('aspectRatio presence detection (for effectiveHeight logic)', () => {
	it('should NOT have aspectRatio in macroParams when only standard params are set', () => {
		// This guards the index.tsx logic: if aspectRatio is absent, we must NOT use the
		// NATIVE_EMBED_PARAMETER_DEFAULTS.aspectRatio value to compute effectiveHeight.
		const params = setParameters({}, { url: 'https://example.com', width: 1200 });
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		expect('aspectRatio' in (macroParams ?? {})).toBe(false);
	});

	it('should have aspectRatio in macroParams when explicitly set via card-transform pattern', () => {
		// Simulates what card-transform does: store aspectRatio = originalWidth / originalHeight
		const originalWidth = 1200;
		const originalHeight = 200;
		const params = setParameters(
			{},
			{ width: originalWidth, aspectRatio: originalWidth / originalHeight },
		);
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		expect('aspectRatio' in (macroParams ?? {})).toBe(true);
		expect(getParameter(params, 'aspectRatio')).toBe(6);
	});

	it('should correctly compute derived height from stored aspectRatio', () => {
		// This mirrors the index.tsx effectiveHeight calculation:
		// effectiveHeight = Math.round(effectiveWidth / aspectRatio)
		const params = setParameters({}, { width: 1200, aspectRatio: 6 });
		const macroParams = (params as { macroParams?: Record<string, unknown> }).macroParams;
		const aspectRatioExplicitlyStored = !!macroParams?.aspectRatio;
		const aspectRatio = getParameter(params, 'aspectRatio');
		const effectiveWidth = getParameter(params, 'width');
		const effectiveHeight =
			aspectRatioExplicitlyStored && aspectRatio > 0 && effectiveWidth != null
				? Math.round(effectiveWidth / aspectRatio)
				: 600;
		expect(effectiveHeight).toBe(200); // Math.round(1200 / 6)
	});
});
