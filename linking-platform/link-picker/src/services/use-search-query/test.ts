import { renderHook } from '@testing-library/react-hooks';

import { type PickerState } from '../../common/types';

import { useSearchQuery } from './index';

describe('useSearchQuery', () => {
	const state: PickerState = {
		url: '',
		displayText: '',
		activeIndex: -1,
		selectedIndex: -1,
		invalidUrl: false,
		activeTab: 0,
		preventHidingRecents: false,
	};

	it('Should return a query if state has a invalid url', () => {
		const { result } = renderHook(() => useSearchQuery({ ...state, url: 'atlassian' }));

		expect(result.current).not.toBeNull();
		expect(result.current).toMatchObject({ query: 'atlassian' });
	});

	it('Should return a query if state has an empty url', () => {
		const { result } = renderHook(() => useSearchQuery({ ...state, url: '' }));

		expect(result.current).not.toBeNull();
		expect(result.current).toMatchObject({ query: '' });
	});

	it('Should return null if state has a valid url', () => {
		const { result } = renderHook(() =>
			useSearchQuery({ ...state, url: 'http://www.atlassian.com' }),
		);

		expect(result.current).toBeNull();
	});

	it('Should return state if valid url is a selcted item', () => {
		const { result, rerender } = renderHook(() => useSearchQuery(state));

		rerender({ ...state, url: 'http://www.atlassian.com', selectedIndex: 1 });

		expect(result.current).not.toBeNull();
	});
});
