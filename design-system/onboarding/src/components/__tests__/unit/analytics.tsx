import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import '../../spotlight';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
	withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
	withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
	createAndFireEvent: jest.fn(() => jest.fn((args) => args)),
}));

describe('Spotlight', () => {
	it('should be wrapped with analytics context', () => {
		expect(withAnalyticsContext).toHaveBeenCalledWith({
			componentName: 'spotlight',
			packageName,
			packageVersion,
		});
	});

	it('should be wrapped with analytics events', () => {
		expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
		expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
			targetOnClick: {
				action: 'clicked',
				actionSubject: 'spotlight',
				attributes: {
					componentName: 'spotlight',
					packageName,
					packageVersion,
				},
			},
		});
	});
});
