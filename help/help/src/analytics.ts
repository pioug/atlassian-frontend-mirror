import * as x from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion } from './version.json';

export const withAnalyticsEvents = x.withAnalyticsEvents;
export const withAnalyticsContext = x.withAnalyticsContext;
export const createAndFire = x.createAndFireEvent('atlaskit');
export const defaultAnalyticsAttributes = {
  componentName: 'help',
  packageName,
  packageVersion,
};
