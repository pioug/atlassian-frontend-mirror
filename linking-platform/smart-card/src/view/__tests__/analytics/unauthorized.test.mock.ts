jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.doMock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client/auth', () => {
	return {
		...jest.requireActual('@atlaskit/outbound-auth-flow-client/auth'),
		auth: jest.fn(),
	};
});
jest.mock('@atlaskit/outbound-auth-flow-client/error', () => {
	const { AuthError } = jest.requireActual('@atlaskit/outbound-auth-flow-client/error');
	return {
		...jest.requireActual('@atlaskit/outbound-auth-flow-client/error'),
		AuthError,
	};
});
jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual<Object>('@atlaskit/link-provider'),
	APIError: jest.fn(),
}));
jest.mock('uuid', () => {
	const actualUuid = jest.requireActual('uuid');
	return {
		...actualUuid,
		__esModule: true,
		v4: jest.fn(),
	};
});

export {};
