import type { StructuredContentSource } from '@atlassian/structured-docs-types/types';

import packageJson from './package.json';

const packagePath = __dirname;

const documentation: StructuredContentSource = {
	components: [
		{
			name: 'TaskItem',
			description:
				'An inline action item with a checkbox and rich-text content. Use it for one independently completable task.',
			status: 'general-availability',
			import: {
				name: 'TaskItem',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Phrase each task as a concrete action so its meaning stays clear when the task is copied or shown out of context.',
				'Keep one task per item; use TaskList when several related actions belong together.',
				'Keep links and other interactive controls outside the task text so the checkbox remains the item’s clear action.',
			],
			accessibilityGuidelines: [
				'The checkbox has the same localized accessible name for every task, so do not rely on that name to identify an item. Keep task text adjacent, group related tasks under a clear heading, and verify keyboard users can reach and toggle each checkbox.',
			],
			contentGuidelines: [
				'Start with an action verb and include the object or outcome needed to complete the task.',
			],
			examples: [
				{
					name: 'Track a small action list',
					description: 'Shows individually controlled tasks inside a labeled TaskList.',
					source: `${packagePath}/examples/ai/task-list.tsx`,
				},
			],
			keywords: ['task', 'action-item', 'checkbox', 'todo'],
			categories: ['data-display', 'interaction'],
		},
		{
			name: 'DecisionItem',
			description:
				'An inline statement of an agreed decision, visually distinct from an action that still needs to be completed.',
			status: 'general-availability',
			import: {
				name: 'DecisionItem',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Record the resolved outcome, not an open question or a proposed option; use TaskItem for follow-up work.',
				'Use DecisionList when presenting multiple outcomes together so readers can scan decisions separately from action items.',
			],
			accessibilityGuidelines: [
				'Keep the decision understandable from its text alone; the accompanying decision icon should not be the only cue that identifies the content.',
			],
			contentGuidelines: [
				'State what was decided in direct language and include the relevant subject or scope.',
			],
			examples: [
				{
					name: 'Record a meeting outcome',
					description:
						'Composes a decision outcome in a DecisionList, separately from pending actions.',
					source: `${packagePath}/examples/ai/decision-list.tsx`,
				},
			],
			keywords: ['decision', 'outcome', 'icon', 'meeting-notes'],
			categories: ['data-display'],
		},
		{
			name: 'TaskList',
			description: 'Groups related TaskItem controls under an accessible group label.',
			status: 'general-availability',
			import: {
				name: 'TaskList',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Group tasks only when they share a parent goal; split unrelated actions into separate lists or sections.',
				'Keep completion state in the app so tasks remain consistent when the surrounding content rerenders.',
			],
			accessibilityGuidelines: [
				'Give each TaskList a nearby heading or context that distinguishes it from other task groups; the component supplies a generic group label.',
			],
			examples: [
				{
					name: 'Track a small action list',
					description:
						'Shows a controlled set of follow-up tasks with independent completion state.',
					source: `${packagePath}/examples/ai/task-list.tsx`,
				},
			],
			keywords: ['tasks', 'checklist', 'actions', 'group'],
			categories: ['data-display', 'interaction'],
		},
		{
			name: 'DecisionList',
			description: 'Presents related DecisionItem outcomes as an ordered decision record.',
			status: 'general-availability',
			import: {
				name: 'DecisionList',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use this list for decisions that have been made; keep unresolved options and follow-up actions in their own content.',
				'Place a descriptive heading nearby to identify the meeting, topic, or scope of the decision record.',
			],
			contentGuidelines: [
				'Order outcomes in the sequence that best explains the discussion, rather than using the list as a list of alternatives to choose from.',
			],
			examples: [
				{
					name: 'Record a meeting outcome',
					description: 'Shows resolved outcomes in a decision record with a nearby topic heading.',
					source: `${packagePath}/examples/ai/decision-list.tsx`,
				},
			],
			keywords: ['decisions', 'outcomes', 'meeting-notes', 'record'],
			categories: ['data-display'],
		},
		{
			name: 'ResourcedTaskItem',
			description:
				'A task control connected to a host task-decision provider for updates associated with an object.',
			status: 'general-availability',
			import: {
				name: 'ResourcedTaskItem',
				package: '@atlaskit/task-decision',
				type: 'named',
				packagePath,
				packageJson,
			},
			usageGuidelines: [
				'Use ResourcedTaskItem when task state is shared through a provider. Use TaskItem when the editor manages state directly.',
				'Use stable task IDs within the source item so updates affect the same task.',
				'The checkbox changes before saving finishes. If a provider update fails, restore the saved state and show the error in your app; the component does not do this itself.',
			],
			accessibilityGuidelines: [
				'The checkbox has the same localized accessible name for every task, so keep each task’s descriptive text adjacent and use a clear heading when several tasks are shown together.',
			],
			contentGuidelines: [
				'Write the task as a clear next action; avoid presenting an optimistic checkmark as durable completion before the host confirms the update.',
			],
			examples: [
				{
					name: 'Connect a task to host state',
					description:
						'Copyable host integration that requires the application’s authenticated TaskDecisionProvider and source object identity.',
					source: `${packagePath}/examples/ai/resourced-task-item.tsx`,
				},
			],
			keywords: ['task', 'provider', 'synchronized', 'object'],
			categories: ['data-display', 'interaction'],
		},
	],
};

export default documentation;
