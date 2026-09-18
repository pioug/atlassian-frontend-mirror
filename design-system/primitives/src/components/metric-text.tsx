/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * IMPORTANT: This is a temporary mapping to avoid breaking changes.
 * We will remove this once we have migrated all the components to @atlaskit/primitives/compiled.
 */

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Metric text comp__
 *
 * A metric text comp {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
 */

import { MetricText, type MetricTextProps } from '../compiled/components/metric-text';

export type { MetricTextProps };
/**
 * @deprecated Use `import { MetricText } from '@atlaskit/primitives/compiled/metric-text'` instead.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-re-exports -- VOLTC-139 tracks removal of this deprecated re-export shim.
export { MetricText };
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports, @atlaskit/volt-strict-mode/no-re-exports -- VOLTC-139 tracks removal of this deprecated re-export shim.
export default MetricText;
