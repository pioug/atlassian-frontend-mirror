/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export const SLI_EVENT_TYPE = 'sli';

export const SMART_EVENT_TYPE = 'smart';

// OLD Analytics
export const MENTION_ANALYTICS_PREFIX: any = 'atlassian.fabric.mention';

/**
 * @deprecated Use `import { fireAnalyticsMentionTypeaheadEvent } from '@atlaskit/mention/analytics'` instead.
 */
export { fireAnalyticsMentionTypeaheadEvent } from './fire-analytics-mention-typeahead-event';
/**
 * @deprecated Use `import { fireAnalyticsMentionEvent } from '@atlaskit/mention/analytics'` instead.
 */
export { fireAnalyticsMentionEvent } from './fire-analytics-mention-event';
/**
 * @deprecated Use `import { fireSliAnalyticsEvent } from '@atlaskit/mention/analytics'` instead.
 */
export { fireSliAnalyticsEvent } from './fire-sli-analytics-event';
/**
 * @deprecated Use `import { buildSliPayload } from '@atlaskit/mention/analytics'` instead.
 */
export { buildSliPayload } from './build-sli-payload';
/**
 * @deprecated Use `import { fireAnalyticsMentionHydrationEvent } from '@atlaskit/mention/analytics'` instead.
 */
export { fireAnalyticsMentionHydrationEvent } from './fire-analytics-mention-hydration-event';
/**
 * @deprecated Use `import { fireAnalytics } from '@atlaskit/mention/analytics'` instead.
 */
export { fireAnalytics } from './fire-analytics';
/**
 * @deprecated Use `import { packageName } from '@atlaskit/mention/analytics'` instead.
 */
export { packageName } from './package-name';
/**
 * @deprecated Use `import { packageVersion } from '@atlaskit/mention/analytics'` instead.
 */
export { packageVersion } from './package-version';
