import * as x from '@atlaskit/analytics-next';

export const withAnalyticsEvents = x.withAnalyticsEvents;
export const withAnalyticsContext = x.withAnalyticsContext;
export const createAndFire = x.createAndFireEvent('atlaskit');
export const defaultAnalyticsAttributes = {
  componentName: 'help',
  packageName: process.env._PACKAGE_NAME_,
  packageVersion: process.env._PACKAGE_VERSION_,
};
