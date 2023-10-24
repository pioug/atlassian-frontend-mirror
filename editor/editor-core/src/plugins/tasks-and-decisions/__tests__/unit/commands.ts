import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { uuid } from '@atlaskit/adf-schema';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import type { DocBuilder } from '@atlaskit/editor-common/types';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  blockquote,
  br,
  decisionItem,
  decisionList,
  doc,
  media,
  mediaGroup,
  p,
  panel,
  taskItem,
  taskList,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { compareSelection } from '@atlaskit/editor-test-helpers/selection';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { insertTaskDecisionCommand } from '../../../../plugins/tasks-and-decisions/commands';
import type { TaskDecisionListType } from '../../../../plugins/tasks-and-decisions/types';
import { selectNode } from '@atlaskit/editor-common/selection';

describe('tasks and decisions - commands', () => {
  const createEditor = createEditorFactory();

  const contextIdentifierProvider = Promise.resolve({
    containerId: 'DUMMY-CONTAINER-ID',
    objectId: 'DUMMY-OBJECT-ID',
    userContext: 'edit',
  });

  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  let providerFactory: ProviderFactory;
  let editorView: EditorView;

  beforeEach(() => {
    uuid.setStatic('local-uuid');
  });

  afterEach(() => {
    uuid.setStatic(false);
  });

  const editorFactory = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    providerFactory = new ProviderFactory();
    providerFactory.setProvider(
      'contextIdentifierProvider',
      contextIdentifierProvider,
    );

    return createEditor({
      doc,
      editorProps: {
        allowAnalyticsGASV3: true,
        allowTasksAndDecisions: true,
        allowTables: {},
        allowPanel: true,
        media: {},
      },
      createAnalyticsEvent,
      providerFactory,
    });
  };

  describe('insertTaskDecisionCommand', () => {
    const scenarios = [
      {
        name: 'action',
        listName: 'taskList' as TaskDecisionListType,
        list: taskList,
        item: taskItem,
        listProps: { localId: 'local-uuid' },
        itemProps: { localId: 'local-uuid', state: 'TODO' },
      },
      {
        name: 'decision',
        listName: 'decisionList' as TaskDecisionListType,
        list: decisionList,
        item: decisionItem,
        listProps: { localId: 'local-uuid' },
        itemProps: { localId: 'local-uuid' },
      },
    ];
    scenarios.forEach(
      ({ name, listName, list, item, listProps, itemProps }) => {
        describe(name, () => {
          it(`can convert paragraph node to ${name}`, () => {
            ({ editorView } = editorFactory(doc(p('Hello{<>} World'))));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>} World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`can convert empty paragraph node to ${name}`, () => {
            ({ editorView } = editorFactory(doc(p('{<>}'))));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            const expectedDoc = doc(list(listProps)(item(itemProps)('{<>}')));
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`can convert empty paragraph (below another paragraph node) to a selected ${name} node`, () => {
            ({ editorView } = editorFactory(doc(p('Hello World'), p('{<>}'))));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            const expectedDoc = doc(
              p('Hello World'),
              list(listProps)(item(itemProps)('{<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`can convert blockquote to ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(blockquote(p('Hello{<>} World'))),
            ));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('Hello World'))),
            );
          });

          it(`can convert blockquote paragraph with multiple paragraphs into ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(blockquote(p('Hello'), p('{<>}Hello'), p('Hello'))),
            ));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                blockquote(p('Hello')),
                list(listProps)(item(itemProps)('{<>}Hello')),
                blockquote(p('Hello')),
              ),
            );
          });

          it(`can convert empty blockquote paragraph with multiple paragraphs into ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(blockquote(p('Hello'), p('Hello'), p('{<>}'))),
            ));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                blockquote(p('Hello'), p('Hello')),
                list(listProps)(item(itemProps)('{<>}')),
              ),
            );
          });

          it(`can convert nested blockquote paragraph with multiple paragraphs into ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(
                table({ localId: 'testId' })(
                  tr(
                    td({})(blockquote(p('hello'), p('{<>}hello'), p('hello'))),
                  ),
                ),
              ),
            ));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            expect(editorView.state.doc).toEqualDocument(
              doc(
                table({ localId: 'testId' })(
                  tr(
                    td({})(
                      blockquote(p('hello')),
                      list(listProps)(item(itemProps)('{<>}hello')),
                      blockquote(p('hello')),
                    ),
                  ),
                ),
              ),
            );
          });

          it(`can convert content with hardbreaks to ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(p('Hello', br(), ' World{<>}')),
            ));
            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello', br(), ' World{<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`when we select media node, inserts the ${name} under it`, () => {
            ({ editorView } = editorFactory(
              doc(
                '{<node>}',
                mediaGroup(
                  media({
                    id: 'test',
                    type: 'file',
                    collection: 'blah',
                  })(),
                ),
              ),
            ));

            insertTaskDecisionCommand(undefined)(listName)(
              editorView.state,
              editorView.dispatch,
            );
            const expectedDoc = doc(
              mediaGroup(
                media({
                  id: 'test',
                  type: 'file',
                  collection: 'blah',
                })(),
              ),
              list(listProps)(item(itemProps)('{<>}')),
            );

            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          describe('when cursor is inside of a block node', () => {
            it(`should append an empty ${name} list after the parent block node`, () => {
              ({ editorView } = editorFactory(doc(panel()(p('te{<>}xt')))));
              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );

              const expectedDoc = doc(
                panel()(p('text')),
                list(listProps)(item(itemProps)('{<>}')),
              );
              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);
            });
          });

          describe(`when cursor is inside non-empty ${name} item`, () => {
            it(`should add a task item to ${name} list`, () => {
              ({ editorView } = editorFactory(
                doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
              ));
              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );

              const expectedDoc = doc(
                list(listProps)(
                  item(itemProps)('Hello World'),
                  item(itemProps)('{<>}'),
                ),
              );

              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);
            });
          });

          describe('when cursor is inside a table', () => {
            it(`should position the cursor correctly after adding ${name}s `, () => {
              ({ editorView } = editorFactory(
                doc(table()(tr(td()(p('{<>}')), td()(p())))),
              ));

              // create new list
              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              let expectedDoc = doc(
                table({ localId: 'local-uuid' })(
                  tr(td()(list(listProps)(item(itemProps)('{<>}'))), td()(p())),
                ),
              );
              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);

              // add item to existing list
              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              expectedDoc = doc(
                table({ localId: 'local-uuid' })(
                  tr(
                    td()(
                      list(listProps)(
                        item(itemProps)(),
                        item(itemProps)('{<>}'),
                      ),
                    ),
                    td()(p()),
                  ),
                ),
              );
              expect(editorView.state.doc).toEqualDocument(expectedDoc);
              compareSelection(editorFactory, expectedDoc, editorView);
            });
          });

          const convertTo =
            listName === 'taskList' ? scenarios[1] : scenarios[0];
          describe(`${listName} <-> ${convertTo.listName}`, () => {
            it(`can convert ${name} to ${convertTo.name}`, () => {
              ({ editorView } = editorFactory(
                doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
              ));
              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Hello World{<>}'),
                  ),
                ),
              );
            });

            it(`can convert first ${name} to ${convertTo.name} when multiple`, () => {
              ({ editorView } = editorFactory(
                doc(
                  list(listProps)(
                    item(itemProps)('{<>}First'),
                    item(itemProps)('Second'),
                    item(itemProps)('Third'),
                  ),
                ),
              ));
              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );

              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('{<>}First'),
                  ),
                  list(listProps)(
                    item(itemProps)('Second'),
                    item(itemProps)('Third'),
                  ),
                ),
              );
            });

            it(`can convert second ${name} to ${convertTo.name} when multiple`, () => {
              ({ editorView } = editorFactory(
                doc(
                  list(listProps)(
                    item(itemProps)('First'),
                    item(itemProps)('Second{<>}'),
                    item(itemProps)('Third'),
                  ),
                ),
              ));
              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );

              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  list(listProps)(item(itemProps)('First')),
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Second{<>}'),
                  ),
                  list(listProps)(item(itemProps)('Third')),
                ),
              );
            });

            it(`can convert last ${name} to ${convertTo.name} when multiple`, () => {
              ({ editorView } = editorFactory(
                doc(
                  list(listProps)(
                    item(itemProps)('First'),
                    item(itemProps)('Second'),
                    item(itemProps)('Third{<>}'),
                  ),
                ),
              ));
              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );

              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  list(listProps)(
                    item(itemProps)('First'),
                    item(itemProps)('Second'),
                  ),
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Third{<>}'),
                  ),
                ),
              );
            });

            it(`can convert ${name} in between ${convertTo.name} lists to ${name}`, () => {
              ({ editorView } = editorFactory(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('First'),
                  ),
                  list(listProps)(item(itemProps)('Second{<>}')),
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Third'),
                  ),
                ),
              ));
              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );

              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('First'),
                    convertTo.item(convertTo.itemProps)('Second{<>}'),
                    convertTo.item(convertTo.itemProps)('Third'),
                  ),
                ),
              );
            });

            it(`should change p -> ${listName} -> ${convertTo.listName} -> ${listName}`, () => {
              ({ editorView } = editorFactory(doc(p('Hello{<>}'))));

              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(list(listProps)(item(itemProps)('Hello{<>}'))),
              );

              insertTaskDecisionCommand(undefined)(convertTo.listName)(
                editorView.state,
                editorView.dispatch,
              );
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Hello{<>}'),
                  ),
                ),
              );

              insertTaskDecisionCommand(undefined)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(list(listProps)(item(itemProps)('Hello{<>}'))),
              );
            });
          });

          describe('analytics', () => {
            const generatePayload = (position: number, listSize: number) => ({
              action: 'inserted',
              actionSubject: 'document',
              actionSubjectId: name,
              eventType: 'track',
              attributes: expect.objectContaining({
                inputMethod: 'toolbar',
                containerAri: 'DUMMY-CONTAINER-ID',
                objectAri: 'DUMMY-OBJECT-ID',
                localId: 'local-uuid',
                listLocalId: 'local-uuid',
                userContext: 'edit',
                position,
                listSize,
              }),
            });

            it('should fire analytics event when add new item when no parent list', async () => {
              let { editorView, editorAPI } = editorFactory(doc(p('{<>}')));
              await contextIdentifierProvider;
              const editorAnalyticsAPI = editorAPI?.analytics
                ?.actions as EditorAnalyticsAPI;
              insertTaskDecisionCommand(editorAnalyticsAPI)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              expect(createAnalyticsEvent).toBeCalledWith(
                generatePayload(0, 1),
              );
            });

            it('should fire analytics event when add item to existing list', async () => {
              let { editorView, sel, editorAPI } = editorFactory(
                doc(p('{<>}')),
              );
              const editorAnalyticsAPI = editorAPI?.analytics
                ?.actions as EditorAnalyticsAPI;
              await contextIdentifierProvider;
              insertTaskDecisionCommand(editorAnalyticsAPI)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              insertText(editorView, 'task 1', sel + 1);
              insertTaskDecisionCommand(editorAnalyticsAPI)(listName)(
                editorView.state,
                editorView.dispatch,
              );
              insertText(editorView, 'task 2', sel + 9);

              expect(createAnalyticsEvent).toBeCalledWith(
                generatePayload(1, 2),
              );

              insertTaskDecisionCommand(editorAnalyticsAPI)(listName)(
                editorView.state,
                editorView.dispatch,
              );

              expect(createAnalyticsEvent).toBeCalledWith(
                generatePayload(2, 3),
              );
            });
          });
        });
      },
    );
  });
  describe('selectTaskDecision', () => {
    const scenarios = [
      {
        name: 'decision',
        listName: 'decisionList' as TaskDecisionListType,
        list: decisionList,
        item: decisionItem,
        listProps: { localId: 'local-uuid' },
        itemProps: { localId: 'local-uuid' },
      },
    ];
    scenarios.forEach(
      ({ name, listName, list, item, listProps, itemProps }) => {
        describe(name, () => {
          const testContent = `this is a ${name}`;
          let refs: { [name: string]: number };
          it('should select node', () => {
            ({ editorView, refs } = editorFactory(
              doc(
                list(listProps)(
                  '{nodeStart}',
                  item(itemProps)(`${testContent}`),
                ),
              ),
            ));
            selectNode(refs['nodeStart'])(
              editorView.state,
              editorView.dispatch,
            );

            const expectedDoc = doc(
              list(listProps)('{<node>}', item(itemProps)(`${testContent}`)),
            );
            expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
          });
          it(`should replace selected node when typing`, () => {
            ({ editorView, refs } = editorFactory(
              doc(
                list(listProps)(
                  '{nodeStart}',
                  item(itemProps)(`${testContent} 1`),
                  item(itemProps)(`${testContent} 2`),
                ),
              ),
            ));
            selectNode(refs['nodeStart'])(
              editorView.state,
              editorView.dispatch,
            );
            insertText(editorView, 'aaa');

            const expectedDoc = doc(
              list(listProps)(item(itemProps)(`aaa{<>}${testContent} 2`)),
            );
            expect(editorView.state).toEqualDocumentAndSelection(expectedDoc);
          });
        });
      },
    );
  });
});
