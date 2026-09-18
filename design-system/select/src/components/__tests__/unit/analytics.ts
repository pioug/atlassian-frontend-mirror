/* eslint-disable @repo/internal/fs/filename-pattern-match */

import createAndFireEvent from '@atlaskit/analytics-next/createAndFireEvents';
import withAnalyticsContext from '@atlaskit/analytics-next/withAnalyticsContext';
import withAnalyticsEvents from '@atlaskit/analytics-next/withAnalyticsEvents';

import '../../../select';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

// This is a global mock for this file that will mock all components wrapped with analytics
// and replace them with an empty SFC that returns null. This includes components imported
// directly in this file and others imported as dependencies of those imports.
jest.mock('@atlaskit/analytics-next/withAnalyticsEvents', () => ({
	...jest.requireActual('@atlaskit/analytics-next/withAnalyticsEvents'),
	__esModule: true,
	default: jest.fn(() => jest.fn(() => () => null)),
}));
jest.mock('@atlaskit/analytics-next/withAnalyticsContext', () => ({
	...jest.requireActual('@atlaskit/analytics-next/withAnalyticsContext'),
	__esModule: true,
	default: jest.fn(() => jest.fn(() => () => null)),
}));
jest.mock('@atlaskit/analytics-next/createAndFireEvents', () => ({
	...jest.requireActual('@atlaskit/analytics-next/createAndFireEvents'),
	__esModule: true,
	default: jest.fn(() => jest.fn((args) => args)),
}));

describe('Select', () => {
	it('should be wrapped with analytics context', () => {
		expect(withAnalyticsContext).toHaveBeenCalledWith({
			componentName: 'select',
			packageName,
			packageVersion,
		});
	});

	it('should be wrapped with analytics events', () => {
		expect(createAndFireEvent).toHaveBeenCalledWith('atlaskit');
		expect(withAnalyticsEvents).toHaveBeenLastCalledWith({
			onChange: {
				action: 'changed',
				actionSubject: 'option',
				attributes: {
					componentName: 'select',
					packageName,
					packageVersion,
				},
			},
		});
	});
});
