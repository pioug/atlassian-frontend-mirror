jest.mock('react', () => ({
	...jest.requireActual<Object>('react'),
	useMemo: jest.fn().mockImplementation((fn) => fn()),
	useCallback: jest.fn().mockImplementation((fn) => fn),
}));

// eslint-disable-next-line no-global-assign
performance = {
	mark: jest.fn(),
	measure: jest.fn(),
	clearMarks: jest.fn(),
} as unknown as Performance;

jest.doMock('../../../utils/analytics/analytics');

jest.doMock('@atlaskit/platform-feature-flags', () => ({
	...jest.requireActual<Object>('@atlaskit/platform-feature-flags'),
	fg: jest.fn().mockReturnValue(false),
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
	rovoOptions: {
		isRovoEnabled: false,
		isRovoLLMEnabled: false,
	},
});

jest.doMock('@atlaskit/link-provider', () => ({
	...jest.requireActual<Object>('@atlaskit/link-provider'),
	useSmartLinkContext: jest.fn(() => mockGetContext()),
}));

jest.doMock('@atlaskit/rovo-triggers/post-message-to-pubsub', () => ({
	ROVO_POST_MESSAGE_EVENT_TYPE: 'rovo-post-message',
}));
jest.doMock('@atlaskit/tmp-editor-statsig/exp-val-equals', () => ({
	expValEquals: jest.fn().mockReturnValue(true),
}));
