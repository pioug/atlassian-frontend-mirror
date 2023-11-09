import {
  EditorNodeContainerModel,
  editorTestCase as test,
  expect,
  EditorTableModel,
  fixTest,
} from '@af/editor-libra';
import {
  documentWithExpand,
  documentWithExpandAndTables,
  documentWithListAndTable,
  documentWithTable,
  emptyDocument,
  tableWithPanel,
} from './rich-text.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  code_block,
  table,
  tr,
  th,
  td,
  nestedExpand,
  expand,
  ol,
  li,
  mention,
  panel,
  a,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('paste', () => {
  test.describe('handlePastingBreakoutMarks', () => {
    test.use({
      adf: JSON.stringify(emptyDocument),
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
      },
    });

    test('pasting full-width code snippet into root of document', async ({
      editor,
    }) => {
      const fullwidthCodeBlock = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><pre><code>hello there</code></pre></div>`;

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthCodeBlock,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(code_block({ language: null, uniqueId: null })('hello there'), p()),
      );
    });
  });
  test.describe('handlePastingBreakoutMarks - table', () => {
    test.use({
      adf: documentWithTable,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('pasting fullwidth code snippet into table', async ({ editor }) => {
      const fullwidthCodeBlock = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><pre><code>hello there</code></pre></div>`;

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthCodeBlock,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                code_block({})('hello there'),
                p(),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });

    test('pasting content, normal width and full width code snippet into table', async ({
      editor,
    }) => {
      const fullwidthAndNormalWidthCodeBlock = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div class="fabric-editor-breakout-mark" data-mode="full-width"><pre><code></code></pre></div><pre><code></code></pre><p>there</p>`;

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthAndNormalWidthCodeBlock,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                p('hello'),
                code_block({})(),
                code_block({})(),
                p('there'),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });

    test('pasting full width expand into table', async ({ editor }) => {
      const fullwidthExpand = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div>`;

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthExpand,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                nestedExpand({ __expanded: true, title: '' })(p()),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });

    test('pasting content, normal width and full width expand into table', async ({
      editor,
    }) => {
      const fullwidthAndNormalWidthExpand = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div><div class="fabric-editor-breakout-mark" data-mode="full-width"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div><p>there</p>`;

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthAndNormalWidthExpand,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                p('hello'),
                nestedExpand({ __expanded: true, title: '' })(p()),
                nestedExpand({ __expanded: true, title: '' })(p()),
                p('there'),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });

    test('pasting full width expand, normal expand, normal code snippet and full width code snippet into table', async ({
      editor,
    }) => {
      const mixedWidthCodeBlocksAndExpand = `<meta charset='utf-8'><p data-pm-slice="1 1 []">hello</p><div class="fabric-editor-breakout-mark" data-mode="full-width"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div><pre><code></code></pre><div class="fabric-editor-breakout-mark" data-mode="full-width"><pre><code></code></pre></div><p>there</p>`;

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: mixedWidthCodeBlocksAndExpand,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                p('hello'),
                nestedExpand({ __expanded: true, title: '' })(p()),
                nestedExpand({ __expanded: true, title: '' })(p()),
                code_block({})(),
                code_block({})(),
                p('there'),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });
  });
  test.describe('handlePastingBreakoutMarks - expand', () => {
    test.use({
      adf: emptyDocument,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('pasting full width expand into root of document', async ({
      editor,
    }) => {
      const fullwidthExpand = `<meta charset='utf-8'><div class="fabric-editor-breakout-mark" data-mode="full-width" data-pm-slice="0 0 []"><div data-node-type="expand" data-title="" data-expanded="true"><p></p></div></div>`;

      await editor.selection.set({
        anchor: 0,
        head: 0,
      });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: fullwidthExpand,
      });
      await editor.waitForEditorStable();
      await expect(editor).toHaveDocument(
        doc(expand({ __expanded: true, title: '' })(p()), p()),
      );
    });
  });
  test.describe('handlers', () => {
    test.use({
      adf: documentWithListAndTable,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('handleRichText: flatten nested list', async ({ editor }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'FIXME: Fails on firefox - ol/li stripped on paste (content remains)',
      });
      await editor.selection.set({
        anchor: 8,
        head: 16,
      });
      await editor.copy();
      await editor.selection.set({
        anchor: 41,
        head: 41,
      });
      await editor.paste();
      await expect(editor).toHaveDocument(
        doc(
          ol({ order: 1 })(
            li(p('a'), ol({ order: 1 })(li(p('b')))),
            li(p('c')),
          ),
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(
                // failing on firefox - not getting bullets
                ol({ order: 1 })(li(p('b')), li(p('c'))),
              ),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p(),
        ),
      );
    });
  });
  test.describe('handlers - restartNumberedLists', () => {
    test.use({
      adf: documentWithListAndTable,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
        featureFlags: {
          restartNumberedLists: true,
        },
      },
    });

    test('handleRichText: flatten nested list with restartNumberedLists', async ({
      editor,
    }) => {
      fixTest({
        jiraIssueId: 'ED-20526',
        reason:
          'FIXME: Fails on firefox - ol/li stripped on paste (content remains)',
      });
      await editor.selection.set({
        anchor: 8,
        head: 16,
      });
      await editor.copy();
      await editor.selection.set({
        anchor: 41,
        head: 41,
      });
      await editor.paste();
      await expect(editor).toHaveDocument(
        doc(
          ol({ order: 1 })(
            li(p('a'), ol({ order: 1 })(li(p('b')))),
            li(p('c')),
          ),
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(
                // failing on firefox - not getting bullets
                ol({ order: 1 })(li(p('b')), li(p('c'))),
              ),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p(),
        ),
      );
    });
  });
  test.describe('links', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
      },
    });
    test('pasting a link while holding shift creates plain (non-inline card) link', async ({
      editor,
    }) => {
      await editor.keyboard.insertText('hello have a link ');
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: 'https://www.atlassian.com',
      });
      await expect(editor).toHaveDocument(
        doc(
          p(
            'hello have a link ',
            a({ href: 'https://www.atlassian.com' })(
              'https://www.atlassian.com',
            ),
          ),
        ),
      );
    });

    test('pasting multiple links while holding shift creates non inline-card links', async ({
      editor,
    }) => {
      await editor.keyboard.type('hello have a link ');
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        text: 'https://www.atlassian.com www.google.com abc.net.au/news/',
        html: 'https://www.atlassian.com www.google.com abc.net.au/news/',
      });
      await expect(editor).toHaveDocument(
        doc(
          p(
            'hello have a link ',
            a({ href: 'https://www.atlassian.com' })(
              'https://www.atlassian.com',
            ),
            ' ',
            a({ href: 'http://www.google.com' })('www.google.com'),
            ' ',
            a({ href: 'http://abc.net.au/news/' })('abc.net.au/news/'),
          ),
        ),
      );
    });
  });
  test.describe('expand', () => {
    test.use({
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('expand copied from renderer and pasted on full-page', async ({
      editor,
    }) => {
      const data =
        '<div id="RendererOutput"><div class="ak-renderer-document"><div data-node-type="expand" data-title="Expand title"><button aria-label="Expand Expand title"><p>Expand title</p></button><div><p>hello there</p></div></div></div></div></div>';

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          expand({ __expanded: true, title: 'Expand title' })(p('hello there')),
        ),
      );
    });
  });

  test.describe('expand - table', () => {
    test.use({
      adf: documentWithTable,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
      },
    });
    test('expand with legal content pasted in table', async ({ editor }) => {
      const data =
        '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><p><span data-mention-id="here" data-access-level="CONTAINER" contenteditable="false" data-user-type="SPECIAL">@here</span> hello</p></div>';

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });

      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                nestedExpand({ __expanded: true, title: 'title' })(
                  p(
                    mention({
                      accessLevel: 'CONTAINER',
                      id: 'here',
                      text: '@here',
                      userType: 'SPECIAL',
                    })(),
                    ' hello',
                  ),
                ),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });

    test('expand with illegal content pasted in table', async ({ editor }) => {
      const data =
        '<div data-node-type="expand" data-title="title" data-pm-slice="0 0 []"><div data-panel-type="info"><div><p>content</p></div></div></div>';

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });

      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          expand({ __expanded: true, title: 'title' })(
            panel({ panelType: 'info' })(p('content')),
          ),
        ),
      );
    });

    test('nestedExpand pasted in table', async ({ editor }) => {
      const data =
        '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';

      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });

      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              th({ colspan: 1, rowspan: 1 })(
                nestedExpand({ __expanded: true, title: 'title' })(
                  p('hello there'),
                ),
              ),
              th({ colspan: 1, rowspan: 1 })(p()),
              th({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
        ),
      );
    });
  });

  test.describe('expand - empty document', () => {
    test.use({
      adf: emptyDocument,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: {
          advanced: true,
        },
      },
    });
    test('nestedExpand pasted on top level', async ({ editor }) => {
      const data =
        '<div data-node-type="nestedExpand" data-title="title" data-pm-slice="0 0 []"><p>hello there</p></div>';

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(expand({ __expanded: true, title: 'title' })(p('hello there'))),
      );
    });

    test('table with nestedExpand pasted on top level', async ({ editor }) => {
      const data =
        '<table data-number-column="false" data-layout="default" data-table-local-id=="abc-123" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="title" data-expanded="true"><p>content</p></div></td></tr></tbody></table>';

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: '="abc-123"',
          })(
            tr(th({ colspan: 1, rowspan: 1 })(p())),
            tr(
              td({ colspan: 1, rowspan: 1 })(
                nestedExpand({ __expanded: true, title: 'title' })(
                  p('content'),
                ),
              ),
            ),
          ),
        ),
      );
    });
    test('expand with table with nestedExpand pasted on top level', async ({
      editor,
    }) => {
      const data =
        '<div data-node-type="expand" data-title="title 1" data-expanded="true" data-pm-slice="0 0 []"><table data-table-local-id=="abc-123" data-number-column="false" data-layout="default" data-autosize="false"><tbody><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="title 2" data-expanded="true"><p>content</p></div></td></tr></tbody></table></div>';

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });

      await expect(editor).toHaveDocument(
        doc(
          expand({ __expanded: true, title: 'title 1' })(
            table({
              __autoSize: false,
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: '="abc-123"',
            })(
              tr(
                td({ colspan: 1, rowspan: 1 })(
                  nestedExpand({ __expanded: true, title: 'title 2' })(
                    p('content'),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    });
  });

  test.describe('expand - extended table config', () => {
    test.use({
      adf: emptyDocument,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowAnalyticsGASV3: true,
        allowTables: {
          allowColumnResizing: true,
          allowMergeCells: true,
          allowNumberColumn: true,
          allowBackgroundColor: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
          permittedLayouts: 'all',
        },
      },
    });
    test('paste table with custom column width in expand and undo', async ({
      editor,
    }) => {
      const data = `<div class="ak-editor-expand ak-editor-expand__type-expand ak-editor-expand__expanded" data-node-type="expand" data-title=""><div class="ak-editor-expand__title-container" tabindex="-1" contenteditable="false"><div class="ak-editor-expand__icon"><div role="presentation" class="css-rq7z01"><button class="ak-editor-expand__icon-container css-1wiphq4-ButtonBase" type="button" tabindex="0"><span class="css-1kejoa0-ButtonBase"><span role="img" aria-label="Collapse content" style="--icon-primary-color: currentColor; --icon-secondary-color: var(--ds-surface, #FFFFFF);" class="css-1u8sedw-Icon"><svg width="24" height="24" viewBox="0 0 24 24" role="presentation"><path d="M10.294 9.698a.988.988 0 010-1.407 1.01 1.01 0 011.419 0l2.965 2.94a1.09 1.09 0 010 1.548l-2.955 2.93a1.01 1.01 0 01-1.42 0 .988.988 0 010-1.407l2.318-2.297-2.327-2.307z" fill="currentColor" fill-rule="evenodd"></path></svg></span></span></button></div></div><div class="ak-editor-expand__input-container"><input class="ak-editor-expand__title-input" value="" placeholder="Give this expand a title..." type="text"></div></div><div class="ak-editor-expand__content"><p><br class="ProseMirror-trailingBreak"></p></div></div><p><br class="ProseMirror-trailingBreak"></p>`;
      const tableData = `<table data-number-column="false" data-layout="default" data-autosize="false" data-table-local-id="7c477492-fa5a-474c-80da-9e5387c6c4aa"><colgroup><col style="width: 330px;"><col style="width: 176px;"><col style="width: 253px;"></colgroup><tbody><tr data-header-row="true" data-is-observed="true" style="grid-template-columns: 330px 176px 253px; width: 760px;"><th data-colwidth="330" class="pm-table-header-content-wrap" id="02ead3d6-3b5b-4cd9-b528-93d772bb9d23"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="0" data-end-index="1" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th><th data-colwidth="176" class="pm-table-header-content-wrap" id="45c712b7-146c-4e75-9b20-46bb260bdd2d"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="1" data-end-index="2" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th><th data-colwidth="253" class="pm-table-header-content-wrap" id="45a51aef-3368-4f9d-bdca-e4f3b4f0c6e4"><div class="pm-table-column-controls-decoration ProseMirror-widget" data-start-index="2" data-end-index="3" contenteditable="false"></div><p><br class="ProseMirror-trailingBreak"></p></th></tr><tr><td data-colwidth="330" class="pm-table-cell-content-wrap" id="cdea43bc-0a08-4e9f-97e9-20e01ac7b053"><p class="pm-table-last-item-in-cell"><br class="ProseMirror-trailingBreak"></p><div class="pm-table-resize-decoration ProseMirror-widget" data-start-index="0" data-end-index="1" contenteditable="false"></div></td><td data-colwidth="176" class="pm-table-cell-content-wrap" id="e6232b77-027c-4ae7-9dfd-0cacffeeb60f"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="253" class="pm-table-cell-content-wrap" id="72388334-525c-443f-8879-31650d893e0b"><p><br class="ProseMirror-trailingBreak"></p></td></tr><tr><td data-colwidth="330" class="pm-table-cell-content-wrap" id="35326d05-c730-4239-baab-c3f3e48b724c"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="176" class="pm-table-cell-content-wrap" id="c74da8ef-dee9-46c0-b097-e1d5dd0708be"><p><br class="ProseMirror-trailingBreak"></p></td><td data-colwidth="253" class="pm-table-cell-content-wrap" id="5a121de7-2bc4-4fc6-83d6-0d3e74c571fa"><p><br class="ProseMirror-trailingBreak"></p></td></tr></tbody></table>`;

      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: tableData,
      });
      await editor.page.waitForSelector('table');
      await editor.undo();
      await expect(editor).toHaveDocument(
        doc(expand({ __expanded: true, title: '' })(p()), p()),
      );
    });
  });

  test.describe('expand - document with expand', () => {
    test.use({
      adf: documentWithExpand,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: true,
      },
    });
    test('table with nestedExpand pasted inside an expand', async ({
      editor,
    }) => {
      const data =
        '<table  data-table-local-id="abc-123" data-number-column="false" data-layout="default" data-autosize="false" data-pm-slice="1 1 []"><tbody><tr><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th><th class="pm-table-header-content-wrap"><p></p></th></tr><tr><td class="pm-table-cell-content-wrap"><div data-node-type="nestedExpand" data-title="111" data-expanded="true"><p>content</p></div></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr><tr><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td><td class="pm-table-cell-content-wrap"><p></p></td></tr></tbody></table>';

      await editor.selection.set({
        anchor: 4,
        head: 4,
      });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          p(),
          expand({ __expanded: true, title: 'title' })(
            table({
              __autoSize: false,
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: 'abc-123',
            })(
              tr(
                th({ colspan: 1, rowspan: 1 })(p()),
                th({ colspan: 1, rowspan: 1 })(p()),
                th({ colspan: 1, rowspan: 1 })(p()),
              ),
              tr(
                td({ colspan: 1, rowspan: 1 })(
                  nestedExpand({ __expanded: true, title: '111' })(
                    p('content'),
                  ),
                ),
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
              ),
              tr(
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
              ),
            ),
          ),
        ),
      );
    });
  });

  test.describe('expand - document with expand and tables', () => {
    test.use({
      adf: documentWithExpandAndTables,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: true,
        shouldFocus: true,
      },
    });
    test('expand pasted inside a table inside an expand', async ({
      editor,
    }) => {
      const data = `<meta charset='utf-8'><div data-node-type="expand" data-title="Copy me nested" data-expanded="true" data-pm-slice="0 0 []"><p>Hello <span data-mention-id="6" data-access-level="" contenteditable="false">@April</span> </p></div>`;
      const nodes = EditorNodeContainerModel.from(editor);
      const tableModel = EditorTableModel.from(nodes.table);
      const firstCell = await tableModel.cell(0);
      await firstCell.click();
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          p(),
          expand({ __expanded: true, title: 'Top level expand!' })(
            table({
              __autoSize: false,
              isNumberColumnEnabled: false,
              layout: 'default',
              localId: 'abc-123',
            })(
              tr(
                th({ colspan: 1, rowspan: 1 })(
                  nestedExpand({ __expanded: true, title: 'Copy me nested' })(
                    p(
                      'Hello ',
                      mention({ accessLevel: '', id: '6', text: '@April' })(),
                      ' ',
                    ),
                  ),
                ),
                th({ colspan: 1, rowspan: 1 })(p()),
                th({ colspan: 1, rowspan: 1 })(p()),
              ),
              tr(
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
              ),
              tr(
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
                td({ colspan: 1, rowspan: 1 })(p()),
              ),
            ),
          ),
        ),
      );
    });
  });

  test.describe('expand - document with table with panel', () => {
    test.use({
      adf: tableWithPanel,
      editorProps: {
        appearance: 'full-page',
        allowExpand: true,
        allowTables: true,
        allowPanel: true,
        shouldFocus: true,
      },
    });
    test('expand pasted inside a panel inside a table should paste below', async ({
      editor,
    }) => {
      const data = `<meta charset='utf-8'><div data-node-type="expand" data-title="Copy me nested" data-expanded="true" data-pm-slice="0 0 []"><p>Hello <span data-mention-id="6" data-access-level="" contenteditable="false">@April</span> </p></div>`;
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              td({ colspan: 1, rowspan: 1 })(
                panel({ panelType: 'info' })(p()),
                nestedExpand({ __expanded: true, title: 'Copy me nested' })(
                  p(
                    'Hello ',
                    mention({ accessLevel: '', id: '6', text: '@April' })(),
                    ' ',
                  ),
                ),
              ),
            ),
          ),
          p(),
        ),
      );
    });

    test('expand content pasted inside a panel inside a table should paste text inside', async ({
      editor,
    }) => {
      const data = `<meta charset='utf-8'><p data-pm-slice="1 1 [&quot;expand&quot;,null]">sda</p>`;
      await editor.selection.set({
        anchor: 5,
        head: 5,
      });
      await editor.simulatePasteEvent({
        pasteAs: 'text/html',
        html: data,
      });
      await expect(editor).toHaveDocument(
        doc(
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              td({ colspan: 1, rowspan: 1 })(
                panel({ panelType: 'info' })(p('sda')),
              ),
            ),
          ),
          p(),
        ),
      );
    });
  });
});
