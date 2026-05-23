/**
 * Testing structured MCP docs for review — ignore this file.
 * Contact #dst-structured-content in Slack with questions.
 */

import path from 'path';

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = path.resolve(__dirname);

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'useSmartLinkLifecycleAnalytics',
			description:
				'Hook that exposes callbacks to fire analytics events for the lifecycle of Smart Links: created, updated, and deleted. Uses the Smart Link context (link-provider) and analytics-next. Call linkCreated, linkUpdated, or linkDeleted when the corresponding action happens in your UI.',
			status: 'general-availability',
			import: {
				name: 'useSmartLinkLifecycleAnalytics',
				package: '@atlaskit/link-analytics',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need to track when links are created, updated, or deleted (e.g. after LinkCreate success, or when a user edits/removes a link). Must be used inside SmartCardProvider and with analytics-next.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Ensure analytics firing does not change focus, interrupt screen readers, or alter semantics.',
			],
			keywords: [
				'link-analytics',
				'analytics',
				'lifecycle',
				'hooks',
				'useSmartLinkLifecycleAnalytics',
			],
			categories: ['linking', 'analytics'],
			examples: [],
		},
		{
			name: 'useDatasourceLifecycleAnalytics',
			description:
				'Hook that exposes callbacks to fire analytics events for the lifecycle of datasources (list of links): created, updated, and deleted. Uses Smart Link context and link-client-extension for datasource operations.',
			status: 'general-availability',
			import: {
				name: 'useDatasourceLifecycleAnalytics',
				package: '@atlaskit/link-analytics',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when you need to track when datasources (e.g. Jira issues list, Confluence search list) are created, updated, or deleted. Must be used inside SmartCardProvider.',
			],
			contentGuidelines: [],
			accessibilityGuidelines: [
				'Ensure analytics firing does not change focus or alter semantics.',
			],
			keywords: [
				'link-analytics',
				'analytics',
				'datasource',
				'lifecycle',
				'hooks',
				'useDatasourceLifecycleAnalytics',
			],
			categories: ['linking', 'analytics'],
			examples: [],
		},
	],
};

export default documentation;
