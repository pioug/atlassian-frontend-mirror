/* eslint-disable no-console */

import type { AnalyticsClient } from '@atlassiansox/analytics-node-client';

import { agent } from './agent';
import { configPath } from './config-path';
import { staffId } from './staff-id';

// eslint-disable-next-line import/no-extraneous-dependencies -- this uses require because not all node versions this package supports use the same import assertions/attributes
const pkgJson = require('@atlaskit/ads-mcp/package.json');

const version = pkgJson.version || '0.0.0-unknown';
let analyticsClient: AnalyticsClient | null = null;
interface OperationalEventOptions {
	action: string;
	actionSubject: string;
	actionSubjectId?: string;
	attributes?: Record<string, any>;
}

/**
 * Send an operational event to analytics
 * Wraps the analytics client and handles errors gracefully
 * If analytics client is not available, this function is a no-op
 */
export function sendOperationalEvent({
	action,
	actionSubject,
	actionSubjectId = '',
	attributes = {},
}: OperationalEventOptions): void {
	// If analytics client is not available, skip analytics
	if (!analyticsClient) {
		return;
	}
	try {
		analyticsClient.sendOperationalEvent({
			anonymousId: 'unknown',
			operationalEvent: {
				action,
				actionSubject,
				actionSubjectId,
				source: '@atlaskit/ads-mcp',
				tags: ['ads-mcp'],
				attributes: {
					version,
					staffId,
					agent,
					configPath,
					...attributes,
				},
			},
		});
	} catch {
		// Analytics errors should not prevent normal operation
		// Silently fail to avoid disrupting the main functionality
		console.error('Error sending operational event to analytics');
	}
}
