import {
	createAndFireEvent,
	withAnalyticsContext,
	withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import '../../components/row';

const packageName = process.env._PACKAGE_NAME_;
const packageVersion = process.env._PACKAGE_VERSION_;

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next', () => ({
	withAnalyticsEvents: jest.fn(() => jest.fn(() => () => null)),
	withAnalyticsContext: jest.fn(() => jest.fn(() => () => null)),
	createAndFireEvent: jest.fn(() => jest.fn((args) => args)),
}));

describe('Row', () => {
	it('should be wrapped with analytics context', () => {
		expect(withAnalyticsContext).toHaveBeenCalledWith({
			componentName: 'row',
			packageName,
			packageVersion,
		});
	});

	it('should be wrapped with analytics events', () => {
		expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
		expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
			onExpand: {
				action: 'expanded',
				actionSubject: 'tableTree',
				attributes: {
					componentName: 'row',
					packageName,
					packageVersion,
				},
			},
			onCollapse: {
				action: 'collapsed',
				actionSubject: 'tableTree',
				attributes: {
					componentName: 'row',
					packageName,
					packageVersion,
				},
			},
		});
	});
});
