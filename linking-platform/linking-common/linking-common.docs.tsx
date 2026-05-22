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
		name: 'Pulse',
		description:
			'Wrapper component that applies a brief pulse animation to its child (e.g. to draw attention to a newly inserted Smart Link or discovery element). Optional callbacks for animation start and iteration.',
		status: 'general-availability',
		import: {
			name: 'Pulse',
			package: '@atlaskit/linking-common',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you want to briefly highlight a newly added link or element (e.g. after insert). Prefer showPulse only when appropriate so the animation is not overused.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Do not rely on the pulse alone to convey meaning; ensure the target has an accessible name. Consider prefers-reduced-motion for users who prefer less motion.',
		],
		keywords: ['linking-common', 'pulse', 'animation', 'discovery'],
		categories: ['linking', 'data-display'],
		examples: [],
	},
	{
		name: 'Skeleton',
		description:
			'Block-level skeleton placeholder with optional shimmer. Used to indicate loading state for Smart Link or other content. Supports width, height, appearance (gray, blue, darkGray), and border radius.',
		status: 'general-availability',
		import: {
			name: 'Skeleton',
			package: '@atlaskit/linking-common',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when content is loading (e.g. link resolution, table data) to show a placeholder that matches the expected layout. Prefer a single skeleton per logical block.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure loading state is announced (e.g. aria-busy on container or live region). Do not put critical information only in the skeleton.',
		],
		keywords: ['linking-common', 'skeleton', 'loading', 'placeholder', 'shimmer'],
		categories: ['linking', 'data-display'],
		examples: [],
	},
	{
		name: 'SpanSkeleton',
		description:
			'Inline (span) skeleton placeholder with optional shimmer. Use for inline loading state (e.g. text or inline link resolving). Same appearance and size options as Skeleton.',
		status: 'general-availability',
		import: {
			name: 'SpanSkeleton',
			package: '@atlaskit/linking-common',
			type: 'named',
			packagePath,
			packageJson,
		},
		usageGuidelines: [
			'Use when you need an inline loading placeholder (e.g. inside a line of text or next to inline content).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the surrounding context or a live region indicates that content is loading.',
		],
		keywords: ['linking-common', 'skeleton', 'SpanSkeleton', 'inline', 'loading'],
		categories: ['linking', 'data-display'],
		examples: [],
	},
	],
};

export default documentation;
