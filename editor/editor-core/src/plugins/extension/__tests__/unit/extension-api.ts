import {
  doc,
  DocBuilder,
  p,
  table,
  tr,
  td,
  taskList,
  taskItem,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { ExtensionAPI } from '@atlaskit/editor-common/extensions';

import { EditorView } from 'prosemirror-view';
import { createExtensionAPI } from '../../extension-api';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
  ACTION_SUBJECT_ID,
} from '../../../analytics';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('ExtensionAPI', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  /**
   * Use `createEditorFactory` here when `allowReferentiliaty: true`, as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditorFn = createEditorFactory<{}>();
  const createEditor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });

    const { editorView } = createEditorFn({
      doc,
      editorProps: {
        featureFlags: {
          'local-id-generation-on-tables': true,
          'data-consumer-mark': true,
        },
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
        allowTasksAndDecisions: true,
        allowAnalyticsGASV3: true,
      },
      createAnalyticsEvent,
    });
    return editorView;
  };

  const createAPI = (editorView: EditorView): ExtensionAPI => {
    return createExtensionAPI({ editorView });
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  // TODO: api.editInContextPanel
  // TODO: api._editInLegacyMacroBrowser ?

  describe('doc.insertAfter()', () => {
    const ParagraphADF = {
      type: 'paragraph',
      content: [{ type: 'text', text: 'hello API!' }],
    };

    it('should insert ADF content after the given localId', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      api.doc.insertAfter('tableId', ParagraphADF);

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          table({ localId: 'tableId' })(
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('hello API!'),
        ),
      );
    });

    it('should throw error when localId type is mismatched', () => {
      const initDoc = doc(p('hello'));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter(
          // @ts-ignore
          {},
          ParagraphADF,
        );
      }).toThrowError("insertAfter(): Invalid localId '[object Object]'.");
    });

    it('should throw error when localId type is empty string', () => {
      const initDoc = doc(p(''));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter('', ParagraphADF);
      }).toThrowError("insertAfter(): Invalid localId ''.");
    });

    it('should throw error when adf type is mismatched', () => {
      const initDoc = doc(p(''));
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        // @ts-ignore
        api.doc.insertAfter('tableId', []);
      }).toThrowError('insertAfter(): Invalid ADF given.');
    });

    it('should throw error when invalid localId is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);
      expect(() => {
        api.doc.insertAfter('fakeId', ParagraphADF);
      }).toThrowError("insertAfter(): Could not find node with ID 'fakeId'.");
    });

    it('should throw error when invalid adf.type specified', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        api.doc.insertAfter('tableId', {
          type: '😑',
          content: [{ type: 'text', text: 'hello API!' }],
        });
      }).toThrowError("insertAfter(): Invalid ADF type '😑'.");
    });

    it('should throw error when invalid adf is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);

      expect(() => {
        const badContentsADF = {
          type: 'paragraph',
          content: [{ type: 'text', donut: 'hello API!' }],
        };
        api.doc.insertAfter('tableId', badContentsADF);
      }).toThrowError('Invalid text node in JSON');
    });

    it('should throw error when invalid marks given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const editorView = createEditor(initDoc);
      const api = createAPI(editorView);
      expect(() => {
        const badMarksADF = {
          type: 'paragraph',
          content: [{ type: 'text', text: 'hello API!' }],
          marks: [{ type: 'lololol' }],
        };
        api.doc.insertAfter('tableId', badMarksADF);
      }).toThrowError('There is no mark type lololol in this schema');
    });

    // TODO: find a way to test this
    // it('should throw error when node created but doc in invalid state', () => {
    //   const initDoc = doc(
    //     table({ localId: 'tableId' })(tr(td()(p()), td({})(p()), td({})(p()))),
    //   );
    //   const editorView = createEditor(initDoc);
    //   const api = createAPI(editorView);

    //   expect(() => {
    //     api.doc.insertAfter('tableId', {
    //       type: 'doc',
    //       content: [
    //         {
    //           type: 'paragraph',
    //         },
    //       ],
    //     });
    //   }).toThrowError(
    //     'insertAfter(): The given ADFEntity cannot not be inserted in the current position.',
    //   );
    // });

    describe('analytics', () => {
      const localId = 'abcd';
      const expectedApiCallPayload = {
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.EXTENSION,
        actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_API,
        attributes: expect.objectContaining({
          functionName: 'insertAfter',
        }),
        eventType: EVENT_TYPE.TRACK,
      };

      it('should fire correctly on single extension node with dataConsumer mark', () => {
        const initDoc = doc(
          table({ localId })(tr(td({})(p()), td({})(p()), td({})(p()))),
        );
        const editorView = createEditor(initDoc);
        const api = createAPI(editorView);
        const adf = {
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.forge',
            extensionKey: 'awesome:list',
            parameters: {
              items: ['a', 'b', 'c', 'd'],
            },
          },
          marks: [
            {
              type: 'dataConsumer',
              attrs: {
                sources: [localId],
              },
            },
          ],
        };

        const expectedNodeInsertionPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: expect.objectContaining({
            nodeType: 'extension',
            inputMethod: INPUT_METHOD.EXTENSION_API,
            hasReferentiality: true,
            nodeTypesReferenced: ['table'],
            layout: 'default',
            extensionType: 'com.atlassian.forge',
            extensionKey: 'awesome:list',
          }),
          eventType: EVENT_TYPE.TRACK,
        };

        api.doc.insertAfter(localId, adf);
        expect(createAnalyticsEvent).toBeCalledWith(expectedApiCallPayload);
        expect(createAnalyticsEvent).toBeCalledWith(
          expectedNodeInsertionPayload,
        );
      });

      it('should fire correctly on multiple extension nodes without dataConsumer mark', () => {
        const initDoc = doc(
          table({ localId })(tr(td({})(p()), td({})(p()), td({})(p()))),
        );
        const editorView = createEditor(initDoc);
        const api = createAPI(editorView);

        const adf = {
          type: 'expand',
          attrs: {
            title: '',
          },
          content: [
            {
              type: 'extension',
              attrs: {
                extensionType: 'com.atlassian.forge',
                extensionKey: 'awesome:list',
                parameters: {
                  items: ['a', 'b', 'c', 'd'],
                },
                layout: 'default',
              },
            },
            {
              type: 'extension',
              attrs: {
                extensionType: 'com.atlassian.forge',
                extensionKey: 'donut:list',
                parameters: {
                  items: ['a', 'b', 'c', 'd'],
                },
                layout: 'default',
              },
            },
          ],
        };

        const baseExpectedNodeInsertionPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          eventType: EVENT_TYPE.TRACK,
        };

        const expectedNodeInsertionPayload1 = {
          ...baseExpectedNodeInsertionPayload,
          attributes: expect.objectContaining({
            nodeType: 'expand',
            hasReferentiality: false,
            nodeTypesReferenced: undefined,
            layout: undefined,
            extensionType: undefined,
            extensionKey: undefined,
          }),
        };

        const expectedNodeInsertionPayload2 = {
          ...baseExpectedNodeInsertionPayload,
          attributes: expect.objectContaining({
            nodeType: 'extension',
            hasReferentiality: false,
            nodeTypesReferenced: undefined,
            layout: 'default',
            extensionType: 'com.atlassian.forge',
            extensionKey: 'awesome:list',
          }),
        };

        const expectedNodeInsertionPayload3 = {
          ...baseExpectedNodeInsertionPayload,
          attributes: expect.objectContaining({
            nodeType: 'extension',
            hasReferentiality: false,
            nodeTypesReferenced: undefined,
            layout: 'default',
            extensionType: 'com.atlassian.forge',
            extensionKey: 'donut:list',
          }),
        };

        api.doc.insertAfter(localId, adf);

        expect(createAnalyticsEvent).toBeCalledWith(expectedApiCallPayload);
        expect(createAnalyticsEvent).toBeCalledWith(
          expectedNodeInsertionPayload1,
        );
        expect(createAnalyticsEvent).toBeCalledWith(
          expectedNodeInsertionPayload2,
        );
        expect(createAnalyticsEvent).toBeCalledWith(
          expectedNodeInsertionPayload3,
        );
      });

      it('should populate nodeTypesReferenced correctly for multiple source ids ', () => {
        const initDoc = doc(
          taskList({ localId: 'a56abded-2572-4cef-9734-f4fc99aabd87' })(
            taskItem({ localId: '0c71a160-36e8-455d-8ace-7f4e19e2eebb' })('1'),
            taskItem({ localId: 'de2b0dc1-f1f2-46a9-9ea5-4f3871751e13' })('2'),
          ),
        );
        const editorView = createEditor(initDoc);
        const api = createAPI(editorView);
        const adf = {
          type: 'extension',
          attrs: {
            extensionType: 'com.atlassian.forge',
            extensionKey: 'awesome:list',
            parameters: {
              items: ['a', 'b', 'c', 'd'],
            },
            layout: 'default',
          },
          marks: [
            {
              type: 'dataConsumer',
              attrs: {
                sources: [
                  'a56abded-2572-4cef-9734-f4fc99aabd87',
                  '0c71a160-36e8-455d-8ace-7f4e19e2eebb',
                ],
              },
            },
          ],
        };

        const expectedNodeInsertionPayload = {
          action: ACTION.INSERTED,
          actionSubject: ACTION_SUBJECT.DOCUMENT,
          attributes: expect.objectContaining({
            nodeType: 'extension',
            inputMethod: INPUT_METHOD.EXTENSION_API,
            hasReferentiality: true,
            nodeTypesReferenced: ['taskList', 'taskItem'],
            layout: 'default',
            extensionType: 'com.atlassian.forge',
            extensionKey: 'awesome:list',
          }),
          eventType: EVENT_TYPE.TRACK,
        };

        api.doc.insertAfter('a56abded-2572-4cef-9734-f4fc99aabd87', adf);
        expect(createAnalyticsEvent).toBeCalledWith(expectedApiCallPayload);
        expect(createAnalyticsEvent).toBeCalledWith(
          expectedNodeInsertionPayload,
        );
      });
    });
  });
});
