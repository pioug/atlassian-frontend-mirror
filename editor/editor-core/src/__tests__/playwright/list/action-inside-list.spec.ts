import { expect, editorTestCase as test } from '@af/editor-libra';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  li,
  p,
  taskItem,
  taskList,
  ul,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { simpleList } from './lists.spec.ts-fixtures';

test.describe('action item inside list', () => {
  test.use({
    editorProps: {
      appearance: 'full-page',
    },
    platformFeatureFlags: {
      'platform.editor.allow-action-in-list': true,
    },
    adf: simpleList,
  });

  test('should render action item inside list using quick insert', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 4, head: 4 });
    await editor.keyboard.type(' /action');
    await editor.keyboard.press('Enter');
    await editor.keyboard.type('action item');
    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('A '), taskList({})(taskItem({ state: 'TODO' })('action item'))),
          li(p('B')),
          li(p('C')),
        ),
      ),
    );
  });

  test('should parse action as a string when pasted to an existing action item nested inside a list', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });

    //Pasting multiple times below
    //First paste should render as an action
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-task-local-id="145" data-task-state="TODO" data-pm-slice="1 1 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null,&quot;taskList&quot;,null]">AAAAA</div>`,
    });
    //Second and third paste should parse it as a string
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-task-local-id="145" data-task-state="TODO" data-pm-slice="1 1 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null,&quot;taskList&quot;,null]">AAAAA</div>`,
    });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-task-local-id="145" data-task-state="TODO" data-pm-slice="1 1 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null,&quot;taskList&quot;,null]">AAAAA</div>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('A')),
          li(
            p('B'),
            taskList({})(taskItem({ state: 'TODO' })('AAAAAAAAAAAAAAA')),
          ),
          li(p('C')),
        ),
      ),
    );
  });

  test('should be able to copy paste an action into a list with correct selection', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-task-local-id="145" data-task-state="TODO" data-pm-slice="1 1 [&quot;table&quot;,null,&quot;tableRow&quot;,null,&quot;tableCell&quot;,null,&quot;taskList&quot;,null]">AAAAA</div>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('A')),
          li(p('B'), taskList({})(taskItem({ state: 'TODO' })('AAAAA'))),
          li(p('C')),
        ),
      ),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 17,
      head: 17,
    });
  });

  test('should be able to copy paste an nested action into a list with correct selection', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="d9708b10-6aa5-430c-86e2-e8cdd05ae35b" style="list-style: none; padding-left: 0" data-pm-slice="2 5 []"><div data-task-local-id="a9b105fe-8a16-487d-8110-3802f9a47b7a" data-task-state="TODO">AAAA</div><div data-node-type="actionList" data-task-list-local-id="8d80d5e0-7249-42c7-b532-698b4f7e5c92" style="list-style: none; padding-left: 0"><div data-task-local-id="79da5061-0ba5-464c-ab9c-8ae70471b1cb" data-task-state="TODO">AAA</div><div data-node-type="actionList" data-task-list-local-id="435d0d90-43c9-402a-8a10-4f05a8591d8d" style="list-style: none; padding-left: 0"><div data-task-local-id="5ebf2c9c-4298-41e5-b835-20eca6383de6" data-task-state="TODO">AA</div><div data-node-type="actionList" data-task-list-local-id="0b7f7139-6c7a-4741-8d48-c420295ae4b4" style="list-style: none; padding-left: 0"><div data-task-local-id="8702a035-b59a-49c0-a54a-890e0e901319" data-task-state="TODO">A</div></div></div></div></div>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('A')),
          li(
            p('B'),
            taskList({})(
              taskItem({ state: 'TODO' })('AAAA'),
              taskList({})(
                taskItem({ state: 'TODO' })('AAA'),
                taskList({})(
                  taskItem({ state: 'TODO' })('AA'),
                  taskList({})(taskItem({ state: 'TODO' })('A')),
                ),
              ),
            ),
          ),
          li(p('C')),
        ),
      ),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 31,
      head: 31,
    });
  });

  test('should be able to copy paste an partial tasklist into a list with correct selection', async ({
    editor,
  }) => {
    await editor.selection.set({ anchor: 9, head: 9 });
    await editor.simulatePasteEvent({
      pasteAs: 'text/html',
      html: `<meta charset='utf-8'><div data-node-type="actionList" data-task-list-local-id="cf9ae1f9-536f-4819-8132-5b6b4658ebb3" style="list-style: none; padding-left: 0" data-pm-slice="2 3 [&quot;taskList&quot;,{&quot;localId&quot;:&quot;ed04dcad-bf3b-4096-b204-b03fbb2e6a4a&quot;},&quot;taskList&quot;,{&quot;localId&quot;:&quot;23a11ebf-b2d7-473f-b8cc-88ec87eb1286&quot;}]"><div data-task-local-id="b8b8c83d-729f-435a-b0ac-0061dab1bdda" data-task-state="TODO">AAA</div><div data-node-type="actionList" data-task-list-local-id="912c6fff-85ff-4ccc-bc07-4a374c6e782c" style="list-style: none; padding-left: 0"><div data-task-local-id="c2335a21-547d-4ff5-95b1-cc0f4aa20b6d" data-task-state="TODO">AAAA</div></div></div>`,
    });
    await expect(editor).toMatchDocument(
      doc(
        ul(
          li(p('A')),
          li(
            p('B'),
            taskList({})(
              taskItem({ state: 'TODO' })(''),
              taskList({})(
                taskItem({ state: 'TODO' })(''),
                taskList({})(
                  taskItem({ state: 'TODO' })('AAA'),
                  taskList({})(taskItem({ state: 'TODO' })('AAAA')),
                ),
              ),
            ),
          ),
          li(p('C')),
        ),
      ),
    );
    await expect(editor).toHaveSelection({
      type: 'text',
      anchor: 28,
      head: 28,
    });
  });
});
