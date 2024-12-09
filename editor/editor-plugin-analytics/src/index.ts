// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

export { analyticsPlugin } from './analyticsPlugin';
export type { AnalyticsPlugin, AnalyticsPluginOptions } from './analyticsPluginType';
export type { CreateAttachPayloadIntoTransaction } from './pm-plugins/analytics-api/attach-payload-into-transaction';
