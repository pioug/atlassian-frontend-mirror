import { act, renderHook } from '@testing-library/react';

import { useIsReducedMotion } from '../../../utils/accessibility';

type MediaQueryListener = (event: MediaQueryListEvent) => void;

const mockPrefersReducedMotion = (initialPrefersReducedMotion: boolean) => {
	let listeners: MediaQueryListener[] = [];

	window.matchMedia = jest.fn().mockImplementation(() => ({
		matches: initialPrefersReducedMotion,
		addEventListener: (_: string, listener: MediaQueryListener) => {
			listeners.push(listener);
		},
		removeEventListener: (_: string, listener: MediaQueryListener) => {
			listeners = listeners.filter((x) => x !== listener);
		},
	}));

	const updatePrefersReducedMotion = (prefersReducedMotion: boolean) => {
		const event: any = { matches: prefersReducedMotion };
		listeners.forEach((listener) => listener(event));
	};

	return { updatePrefersReducedMotion };
};

const mockPrefersReducedMotionUnsupported = () => {
	// @ts-ignore we have to do this to simulate a browser that lacks support
	delete window.matchMedia;
};

describe('useIsReducedMotion', () => {
	test('reduced motion preference starts as FALSE', () => {
		mockPrefersReducedMotion(false);
		const { result: prefersReducedMotion } = renderHook(() => useIsReducedMotion());
		expect(prefersReducedMotion.current).toBe(false);
	});

	test('reduced motion preference starts as TRUE', () => {
		mockPrefersReducedMotion(true);
		const { result: prefersReducedMotion } = renderHook(() => useIsReducedMotion());
		expect(prefersReducedMotion.current).toBe(true);
	});

	test('reduced motion preference starts as FALSE and then changes to TRUE', () => {
		const { updatePrefersReducedMotion } = mockPrefersReducedMotion(false);
		const { result: prefersReducedMotion } = renderHook(() => useIsReducedMotion());
		expect(prefersReducedMotion.current).toBe(false);

		act(() => updatePrefersReducedMotion(true));
		expect(prefersReducedMotion.current).toBe(true);
	});

	test('reduced motion preference starts as TRUE and then changes to FALSE', () => {
		const { updatePrefersReducedMotion } = mockPrefersReducedMotion(true);
		const { result: prefersReducedMotion } = renderHook(() => useIsReducedMotion());
		expect(prefersReducedMotion.current).toBe(true);

		act(() => updatePrefersReducedMotion(false));
		expect(prefersReducedMotion.current).toBe(false);
	});

	test('reduced motion preference is not supported by the browser', () => {
		mockPrefersReducedMotionUnsupported();
		const { result: prefersReducedMotion } = renderHook(() => useIsReducedMotion());
		expect(prefersReducedMotion.current).toBe(false);
	});
});
