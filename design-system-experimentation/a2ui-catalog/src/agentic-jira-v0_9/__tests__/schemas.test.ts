/**
 * Catalog-side guarantee that Agentic Jira v0.9 schemas preserve every
 * declared prop on parse. End-to-end proof lives in
 * `a2ui-renderer-next/src/agentic-jira-v0_9/__tests__/`.
 */

import {
	MultipleChoiceQuestionsSchema,
	RepositoryPickerSchema,
	ToolApprovalSchema,
} from '../schemas';

describe('Agentic Jira v0.9 catalog schemas', () => {
	it('MultipleChoiceQuestions schema preserves questions/value/flags after parse', () => {
		const input = {
			questions: [
				{
					id: 'q1',
					question: 'Pick one',
					description: 'Why we ask',
					options: [
						{ id: 'a', label: 'Option A', description: 'First' },
						{ id: 'b', label: 'Option B' },
					],
				},
			],
			value: { path: '/planning/answers' },
			allowOther: false,
			allowSkip: true,
			disabled: false,
			submitLabel: 'Continue planning',
			onAnswer: { event: { name: 'answered' } },
			onSubmit: {
				event: { name: 'submitted', context: { answers: { path: '/planning/answers' } } },
			},
		};

		const parsed = MultipleChoiceQuestionsSchema.parse(input);

		expect(parsed.questions).toHaveLength(1);
		// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
		expect(parsed.questions[0].options[0].description).toBe('First');
		expect(parsed.value).toEqual({ path: '/planning/answers' });
		expect(parsed.allowOther).toBe(false);
		expect(parsed.allowSkip).toBe(true);
		expect(parsed.submitLabel).toBe('Continue planning');
	});

	it('MultipleChoiceQuestions schema rejects a literal (non-binding) value', () => {
		expect(() =>
			MultipleChoiceQuestionsSchema.parse({
				questions: [],
				value: 'not-a-binding',
			}),
		).toThrow();
	});

	it('RepositoryPicker schema preserves grouped repositories and bindings after parse', () => {
		const input = {
			repositories: [
				{
					name: 'org/repo',
					url: 'https://bitbucket.org/org/repo',
					group: 'suggested' as const,
					confidenceScore: 0.9,
					explanation: 'Linked from the work item',
				},
				{ name: 'org/other', url: 'https://bitbucket.org/org/other' },
			],
			value: { path: '/repo/selection' },
			label: 'Repository',
			allowCustomUrl: true,
			submitLabel: 'Start session',
			onChange: { event: { name: 'repo_selected' } },
			onSubmit: { event: { name: 'repo_confirmed' } },
		};

		const parsed = RepositoryPickerSchema.parse(input);

		// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
		expect(parsed.repositories[0].group).toBe('suggested');
		// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
		expect(parsed.repositories[0].confidenceScore).toBe(0.9);
		// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
		expect(parsed.repositories[1].group).toBeUndefined();
		expect(parsed.value).toEqual({ path: '/repo/selection' });
		expect(parsed.allowCustomUrl).toBe(true);
	});

	it('RepositoryPicker schema rejects an unknown group bucket', () => {
		expect(() =>
			RepositoryPickerSchema.parse({
				repositories: [{ name: 'x', url: 'https://x', group: 'recent' }],
				value: { path: '/repo/selection' },
			}),
		).toThrow();
	});

	it('ToolApproval schema preserves tools/labels/actions after parse', () => {
		const input = {
			tools: [
				{ id: 't1', name: 'create_pull_request', description: 'Opens a PR' },
				{ id: 't2', name: 'post_comment' },
			],
			value: { path: '/approval/decisions' },
			title: 'Agent wants to use this tool',
			allowLabel: 'Approve',
			rejectLabel: 'Deny',
			onDecide: { event: { name: 'decided' } },
			onSubmit: { event: { name: 'submitted' } },
		};

		const parsed = ToolApprovalSchema.parse(input);

		expect(parsed.tools).toHaveLength(2);
		// @ts-expect-error - TS2532 - Object is possibly 'undefined'.
		expect(parsed.tools[0].description).toBe('Opens a PR');
		expect(parsed.value).toEqual({ path: '/approval/decisions' });
		expect(parsed.allowLabel).toBe('Approve');
	});

	it('ToolApproval schema requires the value binding', () => {
		expect(() =>
			ToolApprovalSchema.parse({
				tools: [{ id: 't1', name: 'x' }],
			}),
		).toThrow();
	});
});
