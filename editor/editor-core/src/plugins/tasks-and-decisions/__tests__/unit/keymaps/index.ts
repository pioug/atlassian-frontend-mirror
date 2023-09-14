import { uuid } from '@atlaskit/adf-schema';
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { doc, p } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { compareSelection } from '@atlaskit/editor-test-helpers/selection';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
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
