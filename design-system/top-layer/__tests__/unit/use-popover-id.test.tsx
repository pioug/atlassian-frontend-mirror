import { usePopoverId } from '@atlaskit/top-layer/use-popover-id';
import { renderHook } from '@atlassian/testing-library';

describe('usePopoverId', () => {
	it('returns a non-empty string', () => {
		const utils = renderHook(() => usePopoverId());
		expect(typeof utils.current).toBe('string');
		expect(utils.current.length).toBeGreaterThan(0);
	});

	it('returns the same id across re-renders', () => {
		const utils = renderHook(() => usePopoverId());
		const first = utils.current;

		utils.update();

		expect(utils.current).toBe(first);
	});

	it('returns distinct ids for distinct instances', () => {
		const utils = renderHook(() => usePopoverId());
		const view = renderHook(() => usePopoverId());

		expect(utils.current).not.toBe(view.current);
	});
});
