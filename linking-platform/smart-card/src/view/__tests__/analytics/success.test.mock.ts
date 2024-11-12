jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);
jest.mock('../../../utils/analytics/analytics', () => {
	const actualModule = jest.requireActual('../../../utils/analytics/analytics');
	const spiedModule: any = {};

	Object.keys(actualModule).forEach((key) => {
		const exportValue = actualModule[key];
		// Check if the export is a function
		if (typeof exportValue === 'function') {
			// Wrap the function with jest.fn to spy on it
			spiedModule[key] = jest.fn((...args) => exportValue.apply(this, args));
		} else {
			// For non-function exports, just copy them as-is
			spiedModule[key] = exportValue;
		}
	});

	return spiedModule;
});
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
