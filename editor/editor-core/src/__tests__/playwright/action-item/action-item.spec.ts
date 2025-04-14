import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, taskItem, taskList } from '@atlaskit/editor-test-helpers/doc-builder';

[true, false].forEach((useVanillaDomExperiment) => {
	test.describe(`action item (${useVanillaDomExperiment ? 'with' : 'without'} Vanilla DOM experiment)`, () => {
		test.use({
			editorProps: {
				appearance: 'full-page',
			},
			editorExperiments: {
				platform_editor_vanilla_dom: useVanillaDomExperiment,
			},
		});

		test('should render active action item', async ({ editor }) => {
			await editor.keyboard.type('[x] ');
			await editor.keyboard.type('active action item');

			await expect(editor).toMatchDocument(
				doc(taskList({})(taskItem({ state: 'DONE' })('active action item'))),
			);
		});

		test('should render not active action item', async ({ editor }) => {
			await editor.keyboard.type('[] ');
			await editor.keyboard.type('not active action item');

			await expect(editor).toMatchDocument(
				doc(taskList({})(taskItem({ state: 'TODO' })('not active action item'))),
			);
		});
	});
});
