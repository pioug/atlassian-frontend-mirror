import { getPageVisibilityState, setupHiddenTimingCapture } from '../../index';

describe('hidden-timing without timings', () => {
	it('should return visible as default value when setupHiddenTimingCapture() is not called', () => {
		expect(getPageVisibilityState(0, 99)).toBe('visible');
	});
});

describe('hidden-timing with timings which is smaller than 50(SIZE)', () => {
	// eslint-disable-next-line no-restricted-properties
	const performanceSpy = jest.spyOn(window.performance, 'now');
	const visibilitySpy = jest.spyOn(window.document, 'visibilityState', 'get');

	it('should return the correct status for the given time period', () => {
		setupHiddenTimingCapture();

		// When hidden-timing with timings which is smaller than 50(SIZE)
		for (let i = 1; i < 10; i++) {
			performanceSpy.mockImplementationOnce(() => i * 10);
			visibilitySpy.mockReturnValueOnce(i % 2 === 0 ? 'visible' : 'hidden');
		}

		for (let i = 1; i < 10; i++) {
			document.dispatchEvent(new Event('visibilitychange'));
		}

		// should return visible when window was visible for whole duration
		expect(getPageVisibilityState(1, 9)).toBe('visible');
		// should return hidden when window was hidden for whole duration
		expect(getPageVisibilityState(11, 19)).toBe('hidden');
		// should return mixed when window start visible and became hidden
		expect(getPageVisibilityState(1, 19)).toBe('mixed');
		// should return mixed when window start hidden and became visible
		expect(getPageVisibilityState(11, 49)).toBe('mixed');
		// should return mixed when window start hidden and became visible and then hidden again
		expect(getPageVisibilityState(11, 89)).toBe('mixed');

		// When hidden-timing with timings which is greater than 50(SIZE)
		for (let i = 10; i < 75; i++) {
			performanceSpy.mockImplementationOnce(() => i * 10);
			visibilitySpy.mockReturnValueOnce(i % 2 === 0 ? 'visible' : 'hidden');
		}

		for (let i = 10; i < 75; i++) {
			document.dispatchEvent(new Event('visibilitychange'));
		}

		// should return visible when window was visible for whole duration
		expect(getPageVisibilityState(501, 509)).toBe('visible');
		// should return hidden when window was hidden for whole duration
		expect(getPageVisibilityState(511, 519)).toBe('hidden');
		// should return mixed when window start visible and became hidden
		expect(getPageVisibilityState(511, 529)).toBe('mixed');
		// should return mixed when window start hidden and became visible
		expect(getPageVisibilityState(501, 519)).toBe('mixed');
		// should return mixed when window start hidden and became visible and then hidden again
		expect(getPageVisibilityState(501, 529)).toBe('mixed');
		// should return visible when window was visible for whole duration, when timings are over SIZE
		expect(getPageVisibilityState(741, 999)).toBe('visible');
	});
});
