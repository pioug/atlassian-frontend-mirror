import type { DocBuilder } from '@atlaskit/editor-common/types';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  bodiedExtension,
  doc,
  fragmentMark,
  p,
  table,
  tr,
  td,
  taskList,
  taskItem,
  extension,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { ExtensionAPI } from '@atlaskit/editor-common/extensions';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { createExtensionAPI } from '../../extension-api';
import {
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
  ACTION_SUBJECT_ID,
} from '@atlaskit/editor-common/analytics';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';

describe('ExtensionAPI', () => {
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  /**
   * Use `createEditorFactory` here when `allowReferentiliaty: true`, as
   * `createProsemirrorEditorFactory` has some issues with correctly mimicking
   * old state for the unique localId plugin
   */
  const createEditorFn = createEditorFactory<{}>();
  const createEditor = (doc: DocBuilder, allowFragmentMark = false) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });

    return createEditorFn({
      doc,
      editorProps: {
        allowExtension: true,
        allowTables: true,
        allowLayouts: true,
        allowExpand: true,
        allowTasksAndDecisions: true,
        allowAnalyticsGASV3: true,
        allowFragmentMark,
      },
      createAnalyticsEvent,
    });
  };

  const createAPI = (editorView: EditorView, editorAPI: any): ExtensionAPI => {
    return createExtensionAPI({
      editorView,
      applyChange: undefined,
      editorAnalyticsAPI: editorAPI?.analytics?.actions,
    });
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

    it('should insert ADF content after the given localId and set the selection to the adf content.', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      api.doc.insertAfter('tableId', ParagraphADF, {
        allowSelectionToNewNode: true,
      });

      expect(editorView.state).toEqualDocumentAndSelection(
        doc(
          table({ localId: 'tableId' })(
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('hello API!'),
        ),
      );

      expect(editorView.state.selection instanceof NodeSelection).toBe(true);
    });

    it('should not set the selection to the adf content after insert.', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      api.doc.insertAfter('tableId', ParagraphADF, {
        allowSelectionToNewNode: false,
      });

      expect(editorView.state.selection.empty).toBe(true);
    });

    it('should not set the selection to the adf content after insert by default.', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      api.doc.insertAfter('tableId', ParagraphADF);

      expect(editorView.state.selection.empty).toBe(true);
    });

    it('should throw error when localId type is mismatched', () => {
      const initDoc = doc(p('hello'));
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.insertAfter({} as any, ParagraphADF);
      }).toThrowError("insertAfter(): Invalid localId '[object Object]'.");
    });

    it('should throw error when localId type is empty string', () => {
      const initDoc = doc(p(''));
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.insertAfter('', ParagraphADF);
      }).toThrowError("insertAfter(): Invalid localId ''.");
    });

    it('should throw error when adf type is mismatched', () => {
      const initDoc = doc(p(''));
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.insertAfter('tableId', [] as any);
      }).toThrowError('insertAfter(): Invalid ADF given.');
    });

    it('should throw error when invalid localId is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
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
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.insertAfter('tableId', {
          type: '😑',
          content: [{ type: 'text', text: 'hello API!' }],
        });
      }).toThrowError('insertAfter(): Invalid ADF given.');
    });

    it('should throw error when invalid adf is given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
        p('hello API!'),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        const badContentsADF = {
          type: 'paragraph',
          content: [{ type: 'text', donut: 'hello API!' }],
        };
        api.doc.insertAfter('tableId', badContentsADF);
      }).toThrowError('insertAfter(): Invalid ADF given.');
    });

    it('should throw error when invalid marks given', () => {
      const initDoc = doc(
        table({ localId: 'tableId' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
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
        const { editorView, editorAPI } = createEditor(initDoc);
        const api = createAPI(editorView, editorAPI);
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
        const { editorView, editorAPI } = createEditor(initDoc);
        const api = createAPI(editorView, editorAPI);

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
        const { editorView, editorAPI } = createEditor(initDoc);
        const api = createAPI(editorView, editorAPI);
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

  describe('doc.scrollTo()', () => {
    const createTableWithLocalId = (localId: string) =>
      doc(
        table({ localId })(tr(td({})(p()), td({})(p()), td({})(p()))),
        p('hello API!{<>}'),
      );
    it('should shift cursor to the table source', () => {
      // Cursor is placed on the last index on the doc
      const initDoc = createTableWithLocalId('tableId');
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
      api.doc.scrollTo('tableId');

      /*
          doc         - 0
          table       - 1
          tableRow    - 2
          tableHeader - 3
          paragraph   - 4 (expected cursor position after the function call)
      */
      expect(editorView.state.selection.from).toBe(4);
    });

    it('should throw error when given an empty string', () => {
      const initDoc = createTableWithLocalId('');
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.scrollTo('');
      }).toThrowError("scrollTo(): Invalid localId ''.");
    });

    it('should throw error when given an undefined', () => {
      const initDoc = createTableWithLocalId('tableId');
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.scrollTo(undefined as any);
      }).toThrow();
    });

    it('should throw error when given a number', () => {
      const initDoc = createTableWithLocalId('tableId');
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
      expect(() => {
        api.doc.scrollTo(42 as any);
      }).toThrow();
    });

    it('should throw error when given a mismatched id', () => {
      const initDoc = createTableWithLocalId('tableId');
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
      expect(() => {
        api.doc.scrollTo('fakeId');
      }).toThrowError("scrollTo(): Could not find node with ID 'fakeId'.");
    });

    it('should fire off correct analytics', () => {
      const localId = 'abcd';
      const expectedApiCallPayload = {
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.EXTENSION,
        actionSubjectId: ACTION_SUBJECT_ID.EXTENSION_API,
        attributes: expect.objectContaining({
          functionName: 'scrollTo',
        }),
        eventType: EVENT_TYPE.TRACK,
      };

      const initDoc = doc(
        table({ localId })(tr(td({})(p()), td({})(p()), td({})(p()))),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);
      api.doc.scrollTo(localId);
      expect(createAnalyticsEvent).toBeCalledWith(expectedApiCallPayload);
    });
  });

  describe('doc.update()', () => {
    it('should update marks of the element with the given localId', () => {
      const localId = 'local-id';
      const initDoc = doc(
        extension({
          localId,
          extensionKey: 'key-1',
          extensionType: 'type-1',
        })(),
      );

      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      api.doc.update(
        localId,
        ({ attrs, marks }: Pick<ADFEntity, 'attrs' | 'marks'>) => ({
          attrs,
          marks: (marks ?? []).concat({
            type: 'fragment',
            attrs: { localId: 'fragment-id' },
          }),
        }),
      );

      const adf = new JSONTransformer().encode(editorView.state.doc);
      expect(adf).toEqual({
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'extension',
            attrs: {
              extensionType: 'type-1',
              extensionKey: 'key-1',
              layout: 'default',
              localId: 'local-id',
            },
            marks: [
              {
                type: 'fragment',
                attrs: {
                  localId: 'fragment-id',
                },
              },
            ],
          },
        ],
      });
    });

    it('should update attrs of the element with the given localId', () => {
      const initDoc = doc(
        fragmentMark({ localId: 'localId-1' })(
          bodiedExtension({
            localId: 'localId-2',
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
            parameters: {
              macroParams: {
                param: { value: 'value' },
              },
            },
          })(p('old text')),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      api.doc.update('localId-2', () => ({
        attrs: {
          localId: 'localId-2',
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
          parameters: {
            macroParams: {
              param: { value: 'value' },
              newParam: { value: 'value2' },
            },
          },
        },
      }));

      expect(editorView.state.doc).toEqualDocument(
        doc(
          fragmentMark({ localId: 'localId-1' })(
            bodiedExtension({
              localId: 'localId-2',
              extensionKey: 'fake.extension',
              extensionType: 'atlassian.com.editor',
              parameters: {
                macroParams: {
                  param: { value: 'value' },
                  newParam: { value: 'value2' },
                },
              },
            })(p('old text')),
          ),
        ),
      );
    });

    it('should update the content of the element with the given localId', () => {
      const initDoc = doc(
        fragmentMark({ localId: 'localId-1' })(
          bodiedExtension({
            localId: 'localId-2',
            extensionKey: 'fake.extension',
            extensionType: 'atlassian.com.editor',
          })(p('old text')),
        ),
      );
      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      api.doc.update('localId-2', () => ({
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'hello API!' }],
          },
        ],
      }));

      expect(editorView.state.doc).toEqualDocument(
        doc(
          fragmentMark({ localId: 'localId-1' })(
            bodiedExtension({
              localId: 'localId-2',
              extensionKey: 'fake.extension',
              extensionType: 'atlassian.com.editor',
            })(p('hello API!')),
          ),
        ),
      );
    });

    it('Should update the table with new attrs, content and marks', () => {
      const initDoc = doc(
        table({ localId: 'localId-1' })(
          tr(td({})(p()), td({})(p()), td({})(p())),
        ),
      );

      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      api.doc.update('localId-1', () => ({
        content: [
          {
            type: 'tableRow',
            content: [
              {
                type: 'tableCell',
                attrs: {},
                content: [
                  { type: 'paragraph', content: [{ type: 'text', text: '1' }] },
                ],
              },
              {
                type: 'tableCell',
                attrs: {},
                content: [
                  { type: 'paragraph', content: [{ type: 'text', text: '2' }] },
                ],
              },
              {
                type: 'tableCell',
                attrs: {},
                content: [
                  { type: 'paragraph', content: [{ type: 'text', text: '3' }] },
                ],
              },
            ],
          },
        ],
        attrs: {
          isNumberColumnEnabled: false,
          localId: 'localId-2',
        },
        marks: [
          {
            type: 'fragment',
            attrs: { localId: 'localId-3' },
          },
        ],
      }));

      expect(editorView.state.doc).toEqualDocument(
        doc(
          fragmentMark({ localId: 'localId-3' })(
            table({
              isNumberColumnEnabled: false,
              localId: 'localId-2',
            })(tr(td({})(p('1')), td({})(p('2')), td({})(p('3')))),
          ),
        ),
      );
    });

    it('Should throw error when localId id empty string', () => {
      const initDoc = doc(
        bodiedExtension({
          localId: '1',
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
        })(p('')),
      );
      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);
      expect(() => {
        api.doc.update('', (params) => params);
      }).toThrowError("update(): Invalid localId ''.");
    });

    it('Should throw error when invalid localId is given', () => {
      const initDoc = doc(
        bodiedExtension({
          localId: '1',
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
        })(p('')),
      );
      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);
      expect(() => {
        api.doc.update('2', (params) => params);
      }).toThrowError("update(): Could not find node with ID '2'.");
    });

    it('should throw error when invalid marks given', () => {
      const localId = 'local-id';
      const initDoc = doc(
        table({ localId })(tr(td({})(p()), td({})(p()), td({})(p()))),
      );
      const { editorView, editorAPI } = createEditor(initDoc, false);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.update(
          localId,
          ({ attrs, marks }: Pick<ADFEntity, 'attrs' | 'marks'>) => ({
            attrs,
            marks: (marks ?? []).concat({
              type: 'fragment',
              attrs: { localId },
            }),
          }),
        );
      }).toThrowError("update(): Invalid ADF mark type 'fragment'.");
    });

    it('should throw error when not allowed marks given', () => {
      const localId = 'local-id';
      const initDoc = doc(
        extension({
          localId,
          extensionKey: 'key-1',
          extensionType: 'type-1',
        })(),
      );
      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.update(
          localId,
          ({ attrs, marks }: Pick<ADFEntity, 'attrs' | 'marks'>) => ({
            attrs,
            marks: (marks ?? []).concat({
              type: 'code',
            }),
          }),
        );
      }).toThrowError(
        "update(): Parent of type 'doc' does not allow marks of type 'code'.",
      );
    });

    it('Should throw error when invalid content is given', () => {
      const initDoc = doc(
        bodiedExtension({
          localId: 'localId-1',
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
        })(p('')),
      );

      const { editorView, editorAPI } = createEditor(initDoc, true);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.update('localId-1', ({ attrs, marks }) => ({
          content: {
            type: '😑',
            content: [{ type: 'text', text: 'hello API!' }],
          } as any,
          attrs,
          marks,
        }));
      }).toThrowError('Invalid input for Fragment.fromJSON');
    });

    it('Should throw error when invalid content is given 2', () => {
      const initDoc = doc(
        bodiedExtension({
          localId: 'localId-1',
          extensionKey: 'fake.extension',
          extensionType: 'atlassian.com.editor',
        })(p('')),
      );
      const { editorView, editorAPI } = createEditor(initDoc);
      const api = createAPI(editorView, editorAPI);

      expect(() => {
        api.doc.update('localId-1', ({ attrs, marks }) => ({
          content: {
            type: 'paragraph',
            content: [{ type: 'text', donut: 'hello API!' }],
          } as any,
          attrs,
          marks,
        }));
      }).toThrowError('Invalid input for Fragment.fromJSON');
    });
  });
});
