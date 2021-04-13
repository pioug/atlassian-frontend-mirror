import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { uuid } from '@atlaskit/adf-schema';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { ProviderFactory } from '@atlaskit/editor-common';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
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
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { compareSelection } from '@atlaskit/editor-test-helpers/selection';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

import { insertTaskDecision } from '../../../../plugins/tasks-and-decisions/commands';
import { TaskDecisionListType } from '../../../../plugins/tasks-and-decisions/types';
import { selectNode } from '../../../../utils/commands';

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
  let sel: number;

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
        allowPanel: true,
        media: {},
      },
      createAnalyticsEvent,
      providerFactory,
    });
  };

  const insertTaskDecisionCommand = (listType: TaskDecisionListType) =>
    insertTaskDecision(editorView, listType)(
      editorView.state,
      editorView.dispatch,
    );

  describe('insertTaskDecision', () => {
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
            insertTaskDecisionCommand(listName);

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello{<>} World')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`can convert empty paragraph node to ${name}`, () => {
            ({ editorView } = editorFactory(doc(p('{<>}'))));
            insertTaskDecisionCommand(listName);

            const expectedDoc = doc(list(listProps)(item(itemProps)('{<>}')));
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`can convert empty paragraph (below another paragraph node) to a selected ${name} node`, () => {
            ({ editorView } = editorFactory(doc(p('Hello World'), p('{<>}'))));
            insertTaskDecisionCommand(listName);

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
            insertTaskDecisionCommand(listName);

            expect(editorView.state.doc).toEqualDocument(
              doc(list(listProps)(item(itemProps)('Hello World'))),
            );
          });

          it(`can convert content with hardbreaks to ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(p('Hello', br(), ' World{<>}')),
            ));
            insertTaskDecisionCommand(listName);

            const expectedDoc = doc(
              list(listProps)(item(itemProps)('Hello', br(), ' World{<>}')),
            );
            expect(editorView.state.doc).toEqualDocument(expectedDoc);
            compareSelection(editorFactory, expectedDoc, editorView);
          });

          it(`cannot convert media node to ${name}`, () => {
            ({ editorView } = editorFactory(
              doc(
                mediaGroup(
                  media({
                    id: 'test',
                    type: 'file',
                    collection: 'blah',
                  })(),
                ),
              ),
            ));
            const { tr } = editorView.state;
            tr.setSelection(new NodeSelection(tr.doc.resolve(1)));

            expect(insertTaskDecisionCommand(listName)).toBe(false);
          });

          describe('when cursor is inside of a block node', () => {
            it(`should append an empty ${name} list after the parent block node`, () => {
              ({ editorView } = editorFactory(doc(panel()(p('te{<>}xt')))));
              insertTaskDecisionCommand(listName);

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
              insertTaskDecisionCommand(listName);

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

          const convertTo =
            listName === 'taskList' ? scenarios[1] : scenarios[0];
          describe(`${listName} <-> ${convertTo.listName}`, () => {
            it(`can convert ${name} to ${convertTo.name}`, () => {
              ({ editorView } = editorFactory(
                doc(list(listProps)(item(itemProps)('Hello World{<>}'))),
              ));
              insertTaskDecisionCommand(convertTo.listName);
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
              insertTaskDecisionCommand(convertTo.listName);

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
              insertTaskDecisionCommand(convertTo.listName);

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
              insertTaskDecisionCommand(convertTo.listName);

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
              insertTaskDecisionCommand(convertTo.listName);

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

              insertTaskDecisionCommand(listName);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(list(listProps)(item(itemProps)('Hello{<>}'))),
              );

              insertTaskDecisionCommand(convertTo.listName);
              expect(editorView.state).toEqualDocumentAndSelection(
                doc(
                  convertTo.list(convertTo.listProps)(
                    convertTo.item(convertTo.itemProps)('Hello{<>}'),
                  ),
                ),
              );

              insertTaskDecisionCommand(listName);
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
              ({ editorView } = editorFactory(doc(p('{<>}'))));
              await contextIdentifierProvider;
              insertTaskDecisionCommand(listName);
              expect(createAnalyticsEvent).toBeCalledWith(
                generatePayload(0, 1),
              );
            });

            it('should fire analytics event when add item to existing list', async () => {
              ({ editorView, sel } = editorFactory(doc(p('{<>}'))));
              await contextIdentifierProvider;
              insertTaskDecisionCommand(listName);
              insertText(editorView, 'task 1', sel + 1);
              insertTaskDecisionCommand(listName);
              insertText(editorView, 'task 2', sel + 9);

              expect(createAnalyticsEvent).toBeCalledWith(
                generatePayload(1, 2),
              );

              insertTaskDecisionCommand(listName);

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
            ({ editorView, sel, refs } = editorFactory(
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
