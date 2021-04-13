import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  Preset,
  LightEditorPlugin,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';

import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import hyperlinkPlugin from '../../../hyperlink';
import tasksAndDecisionsPlugin from '../..';

const pasteContent = {
  action: `<meta http-equiv="content-type" content="text/html; charset=utf-8" /><div
    data-task-local-id="0e1e1a30-cc7d-4ffc-a836-ea2f90494ff0"
    data-task-state="TODO"
    data-pm-slice='1 1 ["taskList",null]'
  >plain text <a href="https://www.atlassian.com">link text</a></div>`,
  decision: `<meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <li
    data-decision-local-id="ab2049d8-c3b1-49a5-a1bd-57b1f8c38c5e"
    data-decision-state="DECIDED"
    data-pm-slice='1 1 ["decisionList",null]'
  >plain text <a href="https://www.atlassian.com">link text</a></li>`,
};

const expectedResult = {
  action: {
    type: 'doc',
    content: [
      {
        type: 'taskList',
        content: [
          {
            type: 'taskItem',
            attrs: {
              state: 'TODO',
            },
            content: [
              {
                type: 'text',
                text: 'plain text ',
              },
              {
                type: 'text',
                text: 'link text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'https://www.atlassian.com',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  decision: {
    type: 'doc',
    content: [
      {
        type: 'decisionList',
        content: [
          {
            type: 'decisionItem',
            attrs: {
              state: 'DECIDED',
            },
            content: [
              {
                type: 'text',
                text: 'plain text ',
              },
              {
                type: 'text',
                text: 'link text',
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: 'https://www.atlassian.com',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('Tasks and decisions', () => {
  const editorFactory = createProsemirrorEditorFactory();

  const createEditor = (doc: DocBuilder) =>
    editorFactory({
      doc,
      pluginKey,
      preset: new Preset<LightEditorPlugin>()
        .add(tasksAndDecisionsPlugin)
        .add(hyperlinkPlugin),
    });

  describe('paste with link', () => {
    it('should paste tasks with link', () => {
      const { editorView } = createEditor(doc(p('{<>}')));

      dispatchPasteEvent(editorView, { html: pasteContent.action });

      expect(editorView.state.doc.toJSON()).toMatchObject(
        expectedResult.action,
      );
    });

    it('should paste decisions with link', () => {
      const { editorView } = createEditor(doc(p('{<>}')));

      dispatchPasteEvent(editorView, { html: pasteContent.decision });

      expect(editorView.state.doc.toJSON()).toMatchObject(
        expectedResult.decision,
      );
    });
  });
});
