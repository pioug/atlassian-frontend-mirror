/**
 * Largely taken from analytics-web-react
 */
import merge from 'lodash/merge';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const extractFromEventContext = (
  propertyNames: string[],
  event: UIAnalyticsEvent,
  namespacedContextOnly = true,
  contextName: string,
): any[] =>
  event.context.reduce((acc, contextItem) => {
    propertyNames.forEach((propertyName) => {
      const navContext = contextItem[contextName];
      const navContextProp = navContext ? navContext[propertyName] : null;
      const value = namespacedContextOnly
        ? navContextProp
        : navContextProp || contextItem[propertyName];

      if (value) {
        acc.push(value);
      }
    });
    return acc;
  }, []) as any[];

export const getSources = (event: UIAnalyticsEvent, contextName: string) =>
  extractFromEventContext(['source'], event, false, contextName);

export const getComponents = (event: UIAnalyticsEvent, contextName: string) =>
  extractFromEventContext(
    ['component', 'componentName'],
    event,
    false,
    contextName,
  );

export const getExtraAttributes = (
  event: UIAnalyticsEvent,
  contextName: string,
) =>
  extractFromEventContext(['attributes'], event, true, contextName).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = (event: UIAnalyticsEvent, contextName: string) =>
  event.context
    .map((contextItem) => {
      const navContext = contextItem[contextName];
      const item = navContext ? navContext : contextItem;
      return {
        packageName: item.packageName,
        packageVersion: item.packageVersion,
      };
    })
    .filter((p) => p.packageName);

export const getPackageVersion = (
  event: UIAnalyticsEvent,
  contextName: string,
) => extractFromEventContext(['packageVersion'], event, true, contextName);
