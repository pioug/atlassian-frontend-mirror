import { renderHook } from '@testing-library/react';

import { useSmartCardActions } from '../../actions';
import { useSmartLinkReload } from '../useSmartLinkReload';

jest.mock('../../actions', () => ({
	useSmartCardActions: jest.fn(),
}));

const url = 'https://start.atlassian.com';

describe(useSmartLinkReload.name, () => {
	it('returns reload action', () => {
		const mockedActions = {
			authorize: jest.fn(),
			invoke: jest.fn(),
			register: jest.fn(),
			reload: jest.fn(),
			loadMetadata: jest.fn(),
		};
		jest.mocked(useSmartCardActions).mockReturnValue(mockedActions);

		const { result } = renderHook(() => useSmartLinkReload({ url }));

		expect(result.current).toEqual(mockedActions.reload);
	});
});
