import { expect, editorPerformanceTestCase as test } from '@af/editor-libra';
import { EditorNodeContainerModel } from '@af/editor-libra/page-models';

import {
	manyDates,
	manyDecisions,
	manyEmoji,
	manyStatuses,
	manyTasks,
} from '../fixtures/huge-inline-nodes';

test.use({
	launchOptions: {
		args: ['--js-flags=--expose-gc'],
	},
});

// To test locally
// yarn workspace @af/editor-libra test:performance packages/editor/editor-core/src/__tests__/performance/bulk-node-scenarios/inline-nodes.spec.ts

test.describe('@composable-full-page__memory', () => {
	test.describe('bulk-content-scenarios_inline', () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
				allowTasksAndDecisions: true,
				allowDate: true,
				allowStatus: true,
			},
			editorPerformanceTestOptions: {
				editorVersion: 'complex-full-page-example',
				performanceTestType: 'memory',
			},
		});

		test.describe('dates', () => {
			test.use({
				adf: manyDates,
			});
			test('loads multiple date nodes', async ({ page, editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);
				const nodes = EditorNodeContainerModel.from(editor);
				expect(await nodes.date.count()).toBe(300);
			});
		});

		test.describe('emoji', () => {
			test.use({
				adf: manyEmoji,
			});
			test('loads multiple emoji nodes', async ({ page, editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);
				const nodes = EditorNodeContainerModel.from(editor);
				expect(await nodes.emoji.count()).toBe(300);
			});
		});

		test.describe('status', () => {
			test.use({
				adf: manyStatuses,
			});
			test('loads multiple status nodes', async ({ page, editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);
				const nodes = EditorNodeContainerModel.from(editor);
				expect(await nodes.status.count()).toBe(300);
			});
		});

		test.describe('tasks', () => {
			test.use({
				adf: manyTasks,
			});
			test('loads multiple task nodes', async ({ page, editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);
				const nodes = EditorNodeContainerModel.from(editor);
				expect(await nodes.taskItem.count()).toBe(300);
			});
		});

		test.describe('decisions', () => {
			test.use({
				adf: manyDecisions,
			});
			test('loads multiple decision nodes', async ({ page, editor }) => {
				await editor.selection.set({ anchor: 1, head: 1 });
				await Promise.allSettled([
					editor.keyboard.type('vvcccckddfnektkhdevnkkdvdhhgtnnlteutdhtknick', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfnevlucnkfjcufdreciuetvjchbrkgrdgeu', {
						delay: 0,
					}),

					editor.keyboard.type('vvcccckddfneljrnuugtdkcjtgneufngdfreibucniik', {
						delay: 0,
					}),
				]);
				const nodes = EditorNodeContainerModel.from(editor);
				expect(await nodes.decisionItem.count()).toBe(300);
			});
		});
	});
});
