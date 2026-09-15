import { applyJavaScriptFallbackPositioning } from '../../src/internal/javascript-fallback/apply-javascript-fallback-positioning';
import { resolvePlacement } from '../../src/internal/resolve-placement';

/**
 * The offsets are resolved with a DOM probe, which is a layout flush, so WHEN
 * they are resolved is the behaviour under test. jsdom lays nothing out, so the
 * probe is observed through `appendChild` on the popover rather than by its
 * result.
 */
describe('applyJavaScriptFallbackPositioning()', () => {
	function mount({ gap }: { gap?: string } = {}): {
		anchor: HTMLElement;
		popover: HTMLElement;
		probeSpy: jest.SpyInstance;
		cleanup: () => void;
	} {
		const anchor = document.createElement('button');
		const popover = document.createElement('div');
		document.body.appendChild(anchor);
		document.body.appendChild(popover);
		const probeSpy = jest.spyOn(popover, 'appendChild');

		const cleanupPositioning = applyJavaScriptFallbackPositioning({
			anchor,
			popover,
			// The default gap is a `var()` token, so it has to be probed.
			placement: resolvePlacement({ placement: gap === undefined ? {} : { offset: { gap } } }),
			sizeStyles: [],
		});

		return {
			anchor,
			popover,
			probeSpy,
			cleanup: () => {
				cleanupPositioning();
				anchor.remove();
				popover.remove();
			},
		};
	}

	// `raf-schd` throttles to one call per frame; running the frame synchronously
	// keeps each dispatched event to exactly one `update`.
	let requestAnimationFrameSpy: jest.SpyInstance;
	beforeEach(() => {
		requestAnimationFrameSpy = jest
			.spyOn(window, 'requestAnimationFrame')
			.mockImplementation((callback: FrameRequestCallback) => {
				callback(0);
				return 0;
			});
	});
	afterEach(() => {
		requestAnimationFrameSpy.mockRestore();
	});

	it('resolves the offsets once across many scroll frames', () => {
		const { probeSpy, cleanup } = mount();

		window.dispatchEvent(new Event('scroll'));
		window.dispatchEvent(new Event('scroll'));
		window.dispatchEvent(new Event('scroll'));

		// One probe for the first update; the two later scrolls reused it.
		expect(probeSpy).toHaveBeenCalledTimes(1);

		cleanup();
	});

	it('re-resolves the offsets on resize, which can change what a length means', () => {
		// A viewport unit rather than the default token: a cache keyed on the value
		// alone would hand back the pre-resize pixel count for this one forever.
		const { probeSpy, cleanup } = mount({ gap: '2vh' });

		window.dispatchEvent(new Event('scroll'));
		expect(probeSpy).toHaveBeenCalledTimes(1);

		window.dispatchEvent(new Event('resize'));
		expect(probeSpy).toHaveBeenCalledTimes(2);

		// Back to reusing.
		window.dispatchEvent(new Event('scroll'));
		expect(probeSpy).toHaveBeenCalledTimes(2);

		cleanup();
	});

	it('re-resolves the offsets on each open', () => {
		const { popover, probeSpy, cleanup } = mount();

		window.dispatchEvent(new Event('scroll'));
		expect(probeSpy).toHaveBeenCalledTimes(1);

		// A token can be retargeted while the popover is closed, so the first
		// update after an open must probe again.
		popover.dispatchEvent(Object.assign(new Event('toggle'), { newState: 'open' }));
		window.dispatchEvent(new Event('scroll'));
		expect(probeSpy).toHaveBeenCalledTimes(2);

		cleanup();
	});

	describe('without ResizeObserver', () => {
		const originalResizeObserver = window.ResizeObserver;
		beforeEach(() => {
			// @ts-expect-error -- simulating an environment without it
			window.ResizeObserver = undefined;
		});
		afterEach(() => {
			window.ResizeObserver = originalResizeObserver;
		});

		it('positions an already-open popover immediately and never hides it', () => {
			const anchor = document.createElement('button');
			const popover = document.createElement('div');
			document.body.appendChild(anchor);
			document.body.appendChild(popover);
			// jsdom does not implement `:popover-open`.
			jest.spyOn(popover, 'matches').mockImplementation((selector) => selector === ':popover-open');

			const cleanup = applyJavaScriptFallbackPositioning({
				anchor,
				popover,
				placement: resolvePlacement({ placement: {} }),
				sizeStyles: [],
			});

			// With no first-layout measurement coming, the position is written
			// synchronously rather than never.
			expect(popover.style.getPropertyValue('top')).not.toBe('');
			expect(popover.style.getPropertyValue('left')).not.toBe('');
			expect(popover.style.getPropertyValue('opacity')).toBe('');

			cleanup();
			anchor.remove();
			popover.remove();
		});
	});
});
