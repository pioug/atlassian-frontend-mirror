jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => ({
	auth: jest.fn(),
}));
jest.mock('@atlaskit/link-provider', () => ({
	...jest.requireActual<Object>('@atlaskit/link-provider'),
	APIError: jest.fn(),
}));
jest.mock('uuid', () => {
	const actualUuid = jest.requireActual('uuid');
	return {
		...actualUuid,
		__esModule: true,
		default: jest.fn(),
	};
});

export {};
