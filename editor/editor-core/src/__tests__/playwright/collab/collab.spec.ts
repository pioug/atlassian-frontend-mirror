import {
  EditorTelepointerModel,
  expect,
  fixTest,
  editorCollaborativeTestCase as test,
} from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('collab', () => {
  test.slow();

  fixTest({
    jiraIssueId: 'UTEST-1183',
    reason:
      'Playwright 1.30 has a bug when using multiple contexts in a test. See more: https://atlassian.slack.com/archives/CL6HC337Z/p1702001243539919',
  });

  test('collab should work', async ({ parksEditor, malcolmEditor, ncs }) => {
    await parksEditor.keyboard.type('I am Rosa');
    await malcolmEditor.keyboard.type('I am Malcolm');

    await ncs.waitForRosaStepsToHaveLength(9);
    await ncs.waitForMalcolmStepsToHaveLength(12);

    await malcolmEditor.waitForEditorStable();
    await parksEditor.waitForEditorStable();

    await expect(parksEditor).toHaveDocument(doc(p('I am RosaI am Malcolm')));
    await expect(malcolmEditor).toHaveDocument(doc(p('I am RosaI am Malcolm')));
  });

  test.describe('telepointer', () => {
    test('Should backspace when telepointers are in the same position', async ({
      parksEditor,
      malcolmEditor,
      ncs,
    }) => {
      const model = EditorTelepointerModel.from(malcolmEditor);

      await parksEditor.keyboard.type('Hello');
      await ncs.waitForRosaStepsToHaveLength(4);

      await expect(parksEditor).toHaveSelection({
        type: 'text',
        anchor: 6,
        head: 6,
      });
      await expect(malcolmEditor).toHaveSelection({
        type: 'text',
        anchor: 6,
        head: 6,
      });

      await parksEditor.keyboard.press('ArrowLeft');
      await expect(parksEditor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });

      await model.telepointer.click();
      await expect(malcolmEditor).toHaveSelection({
        type: 'text',
        anchor: 5,
        head: 5,
      });

      await malcolmEditor.keyboard.press('Backspace');

      await ncs.waitForMalcolmStepsToHaveLength(1);

      await malcolmEditor.waitForEditorStable();
      await parksEditor.waitForEditorStable();

      await expect(parksEditor).toHaveDocument(doc(p('Helo')));
      await expect(malcolmEditor).toHaveDocument(doc(p('Helo')));
    });
  });
});
