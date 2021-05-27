import { uuid } from '@atlaskit/adf-schema';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { compareSelection } from '@atlaskit/editor-test-helpers/selection';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';

import { ListTypes } from './_helpers';

describe('tasks and decisions - keymaps', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorFactory = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTables: true,
        allowTasksAndDecisions: true,
        mentionProvider: Promise.resolve(new MockMentionResource({})),
        allowNestedTasks: true,
      },
      createAnalyticsEvent,
    });
  };

  describe.each(ListTypes)('%s', (name, list, item, listProps, itemProps) => {
    describe('Down Arrow', () => {
      it(`should navigate out of ${name}`, () => {
        const { editorView } = editorFactory(
          doc(list(listProps)(item(itemProps)('Hello world{<>}'))),
        );

        sendKeyToPm(editorView, 'ArrowDown');

        const expectedDoc = doc(
          list(listProps)(item(itemProps)('Hello world')),
          p('{<>}'),
        );

        expect(editorView.state.doc).toEqualDocument(expectedDoc);
        compareSelection(editorFactory, expectedDoc, editorView);
      });
    });
  });
});
