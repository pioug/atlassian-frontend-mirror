import { renderHook } from '@testing-library/react-hooks';

import { useInjectedEventAttribute, usePeopleTeamsAnalyticsSubcontext } from './store';

describe('analtyics subcontext', () => {
	describe('AnalyticsSubcontextStore', () => {
		it('should set event attributes on mount & clear on unmount', () => {
			const { result } = renderHook(() => usePeopleTeamsAnalyticsSubcontext());

			expect(result.current[0].eventAttributes).toEqual({});

			const { unmount } = renderHook(() => useInjectedEventAttribute('teamId', 'test-team-id'));

			expect(result.current[0].eventAttributes).toEqual({ teamId: 'test-team-id' });

			unmount();

			expect(result.current[0].eventAttributes).toEqual({});
		});

		it('should only clear the attribute that was set', () => {
			const { result } = renderHook(() => usePeopleTeamsAnalyticsSubcontext());

			const { unmount } = renderHook(() => useInjectedEventAttribute('teamId', 'test-team-id'));

			expect(result.current[0].eventAttributes).toEqual({ teamId: 'test-team-id' });

			const { unmount: unmount2 } = renderHook(() =>
				// @ts-ignore
				useInjectedEventAttribute('testKey', 'test-key-id'),
			);

			expect(result.current[0].eventAttributes).toEqual({
				teamId: 'test-team-id',
				testKey: 'test-key-id',
			});

			unmount2();

			expect(result.current[0].eventAttributes).toEqual({ teamId: 'test-team-id' });

			unmount();

			expect(result.current[0].eventAttributes).toEqual({});
		});
	});
});
