/**
 * Structured MCP docs for `@atlaskit/reactions`.
 */

import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	config: {
		componentPages: true,
		packageTabs: {
			examples: true,
			usage: true,
		},
	},
	package: {
		package: '@atlaskit/reactions',
		packagePath,
		packageJson,
		overview:
			'React components for displaying and managing emoji reactions on content. It includes support for reaction pickers and reaction views with backend integration.',
	},
	components: [
		{
			name: 'ConnectedReactionPicker',
			description: 'A reaction picker component pre-wired with a reactions store.',
			status: 'general-availability',
			import: {
				name: 'ConnectedReactionPicker',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Pass stable containerAri and ari values for the content item receiving reactions. Both values identify its reaction state.',
				'Connect the store to the product service to save reactions. Use an in-memory store for temporary interactions or isolated examples.',
				'Use the product emoji provider so reaction buttons have meaningful emoji names for screen readers.',
			],
			keywords: ['reactions', 'picker', 'emoji'],
			categories: ['elements'],
			examples: [
				{
					name: 'Picker updates shared reactions',
					description:
						'Use a product-supplied store and show the selected state through its paired view.',
					source: `${packagePath}/examples/ai/connected-picker.tsx`,
				},
			],
		},
		{
			name: 'ConnectedReactionsView',
			description: 'A component for displaying the current reactions on a piece of content.',
			status: 'general-availability',
			import: {
				name: 'ConnectedReactionsView',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use a stable `containerAri` and `ari` pair for the content item; never reuse the same pair for unrelated content or reactions can be displayed against the wrong item.',
				'The store owns current-user selection and counts. Keep both values synchronized with successful and failed backend updates so the pressed state and visible total remain truthful.',
				'Reactions are lightweight feedback, not a rating or vote. Do not infer consent, preference, or a representative opinion from reaction totals.',
				'Emoji names and counts form the reaction control’s accessible label. Avoid adding a duplicate textual summary nearby unless it provides information not already conveyed by the controls.',
			],
			keywords: ['reactions', 'view', 'display'],
			categories: ['elements'],
			examples: [
				{
					name: 'Toggle view-only state',
					description:
						'Change whether the person can update reactions while the supplied store remains the source of reaction data.',
					source: `${packagePath}/examples/ai/connected-view.tsx`,
				},
			],
		},
		{
			name: 'Reaction',
			description: 'A single selectable or view-only emoji reaction button.',
			status: 'general-availability',
			import: {
				name: 'Reaction',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use the button for one reaction summary and keep `count` and `reacted` synchronized with the content item’s state.',
				'Use `isViewOnly` when a person can see existing reactions but cannot change them; do not leave an inert-looking button presented as an available action.',
			],
			keywords: ['reactions', 'button', 'emoji'],
			categories: ['elements'],
			examples: [
				{
					name: 'Toggle one reaction',
					description: 'A single button updates its selected state and local count.',
					source: `${packagePath}/examples/ai/reaction-button.tsx`,
				},
			],
		},
		{
			name: 'ReactionPicker',
			description: 'An emoji picker specialized for choosing a reaction.',
			status: 'general-availability',
			import: {
				name: 'ReactionPicker',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use `onSelection` to update the reaction for the content item that opened the picker; keep the selected item’s identity in product-owned state.',
				'The picker renders a dialog. Preserve its trigger relationship, keyboard interaction, and focus return when composing it into a larger interaction.',
			],
			keywords: ['reactions', 'picker', 'emoji'],
			categories: ['elements'],
			examples: [
				{
					name: 'Capture picker selection',
					description: 'Show the selected emoji ID in a local status message.',
					source: `${packagePath}/examples/ai/picker-selection.tsx`,
				},
			],
		},
		{
			name: 'Reactions',
			description: 'The lower-level reactions view and picker surface.',
			status: 'general-availability',
			import: {
				name: 'Reactions',
				package: '@atlaskit/reactions',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use when your app already loads and updates reactions. Pass status, reactions, loadReaction, and update handlers for the same content item.',
				'Use ConnectedReactionsView when the package store should handle loading and toggling. Update counts when saving succeeds or fails.',
			],
			keywords: ['reactions', 'view', 'picker'],
			categories: ['elements'],
			examples: [
				{
					name: 'Update reaction counts',
					description:
						'Add and toggle reaction summaries in local state while the host owns persistence.',
					source: `${packagePath}/examples/ai/reactions.tsx`,
				},
			],
		},
	],
};

export default documentation;
