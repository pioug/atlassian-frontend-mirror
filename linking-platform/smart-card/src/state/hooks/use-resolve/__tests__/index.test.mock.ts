jest.mock('react', () => ({
	...jest.requireActual<Object>('react'),
	useMemo: jest.fn().mockImplementation((fn) => fn()),
	useCallback: jest.fn().mockImplementation((fn) => fn),
}));

jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
	auth: jest.fn(),
}));
import { type CardContext } from '@atlaskit/link-provider';

export const mockGetContext = (): CardContext => ({
	config: {},
	connections: {
		client: {
			prefetchData: jest.fn(),
			fetchData: jest.fn(),
			postData: jest.fn(),
		} as any,
	},
	store: {
		getState: jest.fn(() => ({})),
		dispatch: jest.fn(),
		subscribe: jest.fn(),
		replaceReducer: jest.fn(),
	},
	prefetchStore: {},
	extractors: {
		getPreview: jest.fn(),
	},
});

jest.doMock('@atlaskit/link-provider', () => ({
	...jest.requireActual<Object>('@atlaskit/link-provider'),
	useSmartLinkContext: jest.fn(() => mockGetContext()),
}));
