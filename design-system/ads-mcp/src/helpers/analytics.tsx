/* eslint-disable no-console */
import { userInfo } from 'node:os';

import type { AnalyticsClient } from '@atlassiansox/analytics-node-client';

// eslint-disable-next-line import/no-extraneous-dependencies -- this uses require because not all node versions this package supports use the same import assertions/attributes
const pkgJson = require('@atlaskit/ads-mcp/package.json');

const version = pkgJson.version || '0.0.0-unknown';

// Get staff ID using the same logic as @repo-feature-flags-statsig
export const staffId: string =
	process.env.STAFF_ID || process.env.USER || process.env.ATLAS_USER || userInfo().username;

/**
 * This is a user-passed value via environment to define what agent we may be running in.
 * This could be anything, do not rely on it!
 * @default `'unknown'`
 */
type AGENT = 'cursor' | 'vscode' | 'rovodev' | 'codelassian' | string;

export const agent: AGENT = (process.env.ADSMCP_AGENT as AGENT) || 'unknown';

/**
 * The path to the MCP config file that is being used to run the MCP server
 * e.g. 'mcp.json', 'jira/.cursor/mcp.json', 'platform/.vscode/mcp.json' or 'unknown'
 * This could be anything, do not rely on it!
 * @default `'unknown'`
 */
export const configPath = process.env.ADSMCP_CONFIG_PATH || 'unknown';

// Check if user has opted out of analytics
const isAnalyticsOptedOut =
	String(process.env.ADSMCP_ANALYTICS_OPT_OUT) === 'true' ||
	String(process.env.ADSMCP_ANALYTICS_OPT_OUT) === '1';

// Initialize analytics client with error handling
// If analytics client fails to initialize or user has opted out, we continue without analytics
let analyticsClient: AnalyticsClient | null = null;

if (!isAnalyticsOptedOut) {
	try {
		// Dynamic import to catch initialization errors
		const {
			analyticsClient: createAnalyticsClient,
		} = require('@atlassiansox/analytics-node-client');
		analyticsClient = createAnalyticsClient({
			env: process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
			product: 'atlaskit',
			subproduct: 'ads-mcp',
			flushInterval: 5000,
		});
	} catch {
		// Analytics client not available or failed to initialize
		// Log the error but continue without analytics
		console.error(
			'Could not initialize analytics client. This is normal as it is only intended to measure authenticated Atlassians',
		);
	}
}

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
