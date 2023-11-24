// eslint-disable-next-line import/no-extraneous-dependencies
import type {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  code_block,
  date,
  doc,
  p,
  table,
  td,
  tr,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { createDate } from '../../actions';

describe('date plugin', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowDate: {},
        allowTables: true,
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('actions', () => {
    describe('createDate', () => {
      it('should safe insert date after codeblock', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));

        const tr = createDate(true)(editorView.state);

        expect(tr.doc).toEqualDocument(
          doc(
            code_block()('text'),
            p(date({ timestamp: `${Date.now()}` }), ' '),
          ),
        );
      });

      it('should safe insert date node after codeblock inside same table cell', () => {
        const TABLE_LOCAL_ID = 'test-table-local-id';
        const { editorView } = editor(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(td({})(code_block()('te{<>}xt'))),
            ),
          ),
        );

        const newTr = createDate(true)(editorView.state);

        expect(newTr.doc).toEqualDocument(
          doc(
            table({ localId: TABLE_LOCAL_ID })(
              tr(
                td()(
                  code_block()('text'),
                  p(date({ timestamp: `${Date.now()}` }), ' '),
                ),
              ),
            ),
          ),
        );
      });
    });
  });
});
