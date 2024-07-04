import { renderHook } from '@testing-library/react-hooks';

import { useSmartLinkReload } from '../useSmartLinkReload';
import { useSmartCardActions } from '../../actions';

jest.mock('../../actions', () => ({
	useSmartCardActions: jest.fn(),
}));
jest.mock('../../analytics', () => ({
	useSmartLinkAnalytics: jest.fn(),
}));

const url = 'https://start.atlassian.com';
const analytics = () => {};

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

		const { result } = renderHook(() => useSmartLinkReload({ url, analyticsHandler: analytics }));

		expect(result.current).toEqual(mockedActions.reload);
	});
});
