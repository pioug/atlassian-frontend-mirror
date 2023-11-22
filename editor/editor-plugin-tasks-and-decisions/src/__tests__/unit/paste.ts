import { link } from '@atlaskit/adf-schema';
import type {
  DocBuilder,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';

import { tasksAndDecisionsPlugin } from '../../index';

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

// So we don't introduce another plugin dependency to this package
const mockLinkPlugin: NextEditorPlugin<'hyperlink'> = ({ config }) => ({
  name: 'hyperlink',
  marks() {
    return [{ name: 'link', mark: link }];
  },
});

describe('Tasks and decisions', () => {
  const editorFactory = createProsemirrorEditorFactory();

  const createEditor = (doc: DocBuilder) =>
    editorFactory({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([analyticsPlugin, {}])
        .add(tasksAndDecisionsPlugin)
        .add(mockLinkPlugin),
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
