/**
 * Largely taken from analytics-web-react
 */

import merge from 'lodash/merge';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export const extractFromEventContext = (
  propertyName: string,
  event: UIAnalyticsEvent,
) =>
  event.context
    .map((contextItem: any) => contextItem[propertyName])
    .filter(Boolean);

export const getActionSubject = (event: UIAnalyticsEvent) => {
  const overrides = extractFromEventContext('actionSubjectOverride', event);

  const closestContext =
    event.context.length > 0 ? event.context[event.context.length - 1] : {};

  const actionSubject = event.payload.actionSubject || closestContext.component;

  return overrides.length > 0 ? overrides[0] : actionSubject;
};

export const getSources = (event: UIAnalyticsEvent) =>
  extractFromEventContext('source', event);

export const getComponents = (event: UIAnalyticsEvent) =>
  extractFromEventContext('component', event);

export const getExtraAttributes = (event: UIAnalyticsEvent) =>
  extractFromEventContext('attributes', event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = (event: UIAnalyticsEvent) =>
  event.context
    .map((contextItem) => ({
      packageName: contextItem.packageName,
      packageVersion: contextItem.packageVersion,
    }))
    .filter((p) => p.packageName);

export const getPackageVersion = (event: UIAnalyticsEvent) =>
  extractFromEventContext('packageVersion', event);

// This function scans the whole context and looks for context data that includes packageName at the root of the object.
// Every package should include this info once, just to differentiate between packages, but no between internal components of each package
// If no context data brings a packageName, the map function retuns an empty string that is replaced for "undefined"
export function getPackageHierarchy(
  event: UIAnalyticsEvent,
): string | undefined {
  const packages = getPackageInfo(event) || [];
  return (
    packages
      .map((p) =>
        p.packageVersion
          ? `${p.packageName}@${p.packageVersion}`
          : p.packageName,
      )
      .join(',') || undefined
  );
}
