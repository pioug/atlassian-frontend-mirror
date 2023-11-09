import { editorTestCase as test, expect } from '@af/editor-libra';
import {
  documentWithTextAndSimpleTable,
  documentWithTextAndComplexTable,
  documentWithSimpleTableAndText,
  documentWithComplexTableAndText,
  documentWithParagraphsInTableCell,
} from './rich-text.spec.ts-fixtures';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  p,
  table,
  tr,
  th,
  td,
  h2,
  ul,
  emoji,
  unsupportedInline,
  blockCard,
  em,
  alignment,
  code,
  inlineCard,
  code_block,
  li,
  mention,
  nestedExpand,
  panel,
  strong,
  taskItem,
  taskList,
  underline,
} from '@atlaskit/editor-test-helpers/doc-builder';

test.describe('paste', () => {
  test.describe('tables - documentWithTextAndSimpleTable', () => {
    test.use({
      adf: documentWithTextAndSimpleTable,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test('when text and part of simple table and text outside is selected, should still paste table', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 1, head: 57 });
      await editor.copy();
      await editor.selection.set({ anchor: 57, head: 57 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p('hello'),
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
              td({ colspan: 1, rowspan: 1 })(p('world')),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p('hello'),
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
              td({ colspan: 1, rowspan: 1 })(p('world')),
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

  test.describe('tables - doc with simple table and text', () => {
    test.use({
      adf: documentWithSimpleTableAndText,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });
    test('when part of simple table and text outside is selected, should still paste table', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 24, head: 57 });
      await editor.copy();
      await editor.selection.set({ anchor: 59, head: 59 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p(),
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
              td({ colspan: 1, rowspan: 1 })(p('hello')),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p('world'),
          table({
            __autoSize: false,
            isNumberColumnEnabled: false,
            layout: 'default',
            localId: 'abc-123',
          })(
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p('hello')),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p('world'),
        ),
      );
    });
  });

  test.describe('tables - doc with text and complex table', () => {
    test.use({
      adf: documentWithTextAndComplexTable,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test('when text and part of complex table and text outside is selected, should still paste table', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 1, head: 173 });
      await editor.copy();
      await editor.selection.set({ anchor: 196, head: 196 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p('hello'),
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              th({})(
                alignment({ align: 'center' })(
                  p(
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          color: 'neutral',
                          localId: 'def-456',
                          style: '',
                          text: 'some status',
                        },
                        type: 'status',
                      },
                    })(),
                    ' ',
                  ),
                ),
                alignment({ align: 'center' })(
                  p(
                    emoji({
                      shortName: ':grinning:',
                      id: '1f600',
                      text: '😀',
                    })(),
                    ' ',
                    emoji({
                      shortName: ':disappointed:',
                      id: '1f61e',
                      text: '😞',
                    })(),
                    ' ',
                  ),
                ),
              ),
              th({})(
                p(
                  unsupportedInline({
                    originalValue: {
                      attrs: {
                        timestamp: '1646870400000',
                      },
                      type: 'date',
                    },
                  })(),
                  ' ',
                ),
                p(
                  'Some ',
                  code('code'),
                  ' and ',
                  inlineCard({
                    url: null as unknown as string,
                    data: {
                      '@context': 'https://www.w3.org/ns/activitystreams',
                      '@type': 'Document',
                      name: 'Welcome to Atlassian!',
                      url: 'http://www.atlassian.com',
                    },
                  })(),
                  ' ',
                ),
              ),
              th({})(
                h2('BIGGER'),
                code_block({})('some code'),
                panel({ panelType: 'error' })(p('some panel!')),
              ),
            ),
            tr(
              td({})(
                ul(
                  li(
                    p(underline(strong(em('more')))),
                    ul(li(p('other things'))),
                  ),
                  li(
                    p(
                      'things ',
                      unsupportedInline({
                        originalValue: {
                          attrs: {
                            color: 'red',
                            localId: 'ghi-789',
                            style: '',
                            text: 'some status',
                          },
                          type: 'status',
                        },
                      })(),
                    ),
                  ),
                ),
                nestedExpand({ title: 'expand title' })(p('some expand')),
                taskList({ localId: 'abc-123' })(
                  taskItem({ localId: 'abc-123' })(
                    'some action ',
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          timestamp: '1646870400000',
                        },
                        type: 'date',
                      },
                    })(),
                    ' ',
                  ),
                ),
                p(
                  mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                  ' ',
                ),
                blockCard({
                  url: null as unknown as string,
                  data: {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    '@type': 'Document',
                    name: 'Welcome to Atlassian!',
                    url: 'http://www.atlassian.com',
                  },
                })(),
                p(' '),
              ),
              td({})(p('world')),
              td({})(p()),
            ),
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('hello'),
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              th({})(
                alignment({ align: 'center' })(
                  p(
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          color: 'neutral',
                          localId: 'def-456',
                          style: '',
                          text: 'some status',
                        },
                        type: 'status',
                      },
                    })(),
                    ' ',
                  ),
                ),
                alignment({ align: 'center' })(
                  p(
                    emoji({
                      shortName: ':grinning:',
                      id: '1f600',
                      text: '😀',
                    })(),
                    ' ',
                    emoji({
                      shortName: ':disappointed:',
                      id: '1f61e',
                      text: '😞',
                    })(),
                    ' ',
                  ),
                ),
              ),
              th({})(
                p(
                  unsupportedInline({
                    originalValue: {
                      attrs: {
                        timestamp: '1646870400000',
                      },
                      type: 'date',
                    },
                  })(),
                  ' ',
                ),
                p(
                  'Some ',
                  code('code'),
                  ' and ',
                  inlineCard({
                    url: null as unknown as string,
                    data: {
                      '@context': 'https://www.w3.org/ns/activitystreams',
                      '@type': 'Document',
                      name: 'Welcome to Atlassian!',
                      url: 'http://www.atlassian.com',
                    },
                  })(),
                  ' ',
                ),
              ),
              th({})(
                h2('BIGGER'),
                code_block({})('some code'),
                panel({ panelType: 'error' })(p('some panel!')),
              ),
            ),
            tr(
              td({})(
                ul(
                  li(
                    p(underline(strong(em('more')))),
                    ul(li(p('other things'))),
                  ),
                  li(
                    p(
                      'things ',
                      unsupportedInline({
                        originalValue: {
                          attrs: {
                            color: 'red',
                            localId: 'ghi-789',
                            style: '',
                            text: 'some status',
                          },
                          type: 'status',
                        },
                      })(),
                    ),
                  ),
                ),
                nestedExpand({ title: 'expand title' })(p('some expand')),
                taskList({ localId: 'abc-123' })(
                  taskItem({ localId: 'abc-123' })(
                    'some action ',
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          timestamp: '1646870400000',
                        },
                        type: 'date',
                      },
                    })(),
                    ' ',
                  ),
                ),
                p(
                  mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                  ' ',
                ),
                blockCard({
                  url: null as unknown as string,
                  data: {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    '@type': 'Document',
                    name: 'Welcome to Atlassian!',
                    url: 'http://www.atlassian.com',
                  },
                })(),
                p(' '),
              ),
              td({})(p('world')),
              td({})(p()),
            ),
          ),
        ),
      );
    });
  });

  test.describe('tables - doc with complex table and text', () => {
    test.use({
      adf: documentWithComplexTableAndText,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test('when part of complex table and text outside the table is selected, should still paste table', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 82, head: 198 });
      await editor.copy();
      await editor.selection.set({ anchor: 200, head: 200 });
      await editor.paste();
      await expect(editor).toMatchDocument(
        doc(
          p(),
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              th({})(
                alignment({ align: 'center' })(
                  p(
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          color: 'neutral',
                          localId: 'def-456',
                          style: '',
                          text: 'some status',
                        },
                        type: 'status',
                      },
                    })(),
                    ' ',
                  ),
                ),
                alignment({ align: 'center' })(
                  p(
                    emoji({
                      shortName: ':grinning:',
                      id: '1f600',
                      text: '😀',
                    })(),
                    ' ',
                    emoji({
                      shortName: ':disappointed:',
                      id: '1f61e',
                      text: '😞',
                    })(),
                    ' ',
                  ),
                ),
                alignment({ align: 'center' })(p()),
              ),
              th({})(
                p(
                  unsupportedInline({
                    originalValue: {
                      attrs: {
                        timestamp: '1646870400000',
                      },
                      type: 'date',
                    },
                  })(),
                  ' ',
                ),
                p(
                  'Some ',
                  code('code'),
                  ' and ',
                  inlineCard({
                    url: null as unknown as string,
                    data: {
                      '@context': 'https://www.w3.org/ns/activitystreams',
                      '@type': 'Document',
                      name: 'Welcome to Atlassian!',
                      url: 'http://www.atlassian.com',
                    },
                  })(),
                  ' ',
                ),
              ),
              th({})(
                h2('BIGGER'),
                code_block({})('some code'),
                panel({ panelType: 'error' })(p('some panel!')),
              ),
            ),
            tr(
              td({})(
                alignment({ align: 'center' })(p('hello')),
                ul(
                  li(p(underline(strong(em('more'))))),
                  li(p('other things')),
                  li(
                    p(
                      'things ',
                      unsupportedInline({
                        originalValue: {
                          attrs: {
                            color: 'red',
                            localId: 'ghi-789',
                            style: '',
                            text: 'some status',
                          },
                          type: 'status',
                        },
                      })(),
                    ),
                  ),
                ),
                nestedExpand({ title: 'expand title' })(p('some expand')),
                taskList({ localId: 'abc-123' })(
                  taskItem({ localId: 'abc-123' })(
                    'some action ',
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          timestamp: '1646870400000',
                        },
                        type: 'date',
                      },
                    })(),
                    ' ',
                  ),
                ),
                p(
                  mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                  ' ',
                ),
                blockCard({
                  url: null as unknown as string,
                  data: {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    '@type': 'Document',
                    name: 'Welcome to Atlassian!',
                    url: 'http://www.atlassian.com',
                  },
                })(),
                p(' '),
              ),
              td({})(p()),
              td({})(p()),
            ),
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('world'),
          table({ isNumberColumnEnabled: false, layout: 'default' })(
            tr(
              td({})(
                alignment({ align: 'center' })(p('hello')),
                ul(
                  li(p(underline(strong(em('more'))))),
                  li(p('other things')),
                  li(
                    p(
                      'things ',
                      unsupportedInline({
                        originalValue: {
                          attrs: {
                            color: 'red',
                            localId: 'ghi-789',
                            style: '',
                            text: 'some status',
                          },
                          type: 'status',
                        },
                      })(),
                    ),
                  ),
                ),
                nestedExpand({ title: 'expand title' })(p('some expand')),
                taskList({ localId: 'abc-123' })(
                  taskItem({ localId: 'abc-123' })(
                    'some action ',
                    unsupportedInline({
                      originalValue: {
                        attrs: {
                          timestamp: '1646870400000',
                        },
                        type: 'date',
                      },
                    })(),
                    ' ',
                  ),
                ),
                p(
                  mention({ id: '0', text: '@Carolyn', accessLevel: '' })(),
                  ' ',
                ),
                blockCard({
                  url: null as unknown as string,
                  data: {
                    '@context': 'https://www.w3.org/ns/activitystreams',
                    '@type': 'Document',
                    name: 'Welcome to Atlassian!',
                    url: 'http://www.atlassian.com',
                  },
                })(),
                p(' '),
              ),
              td({})(p()),
              td({})(p()),
            ),
            tr(td({})(p()), td({})(p()), td({})(p())),
          ),
          p('world'),
        ),
      );
    });
  });

  test.describe('tables - doc with paragraphs in table cell', () => {
    test.use({
      adf: documentWithParagraphsInTableCell,
      editorProps: {
        appearance: 'full-page',
        allowTables: {
          advanced: true,
        },
        allowPanel: true,
        allowExpand: true,
        media: {
          allowMediaSingle: true,
        },
        allowTextAlignment: true,
        smartLinks: {
          allowBlockCards: true,
          allowEmbeds: true,
        },
      },
    });

    test("when selecting multiple paragraphs in a table cell, shouldn't paste table", async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 18, head: 40 });
      await editor.copy();
      await editor.selection.set({ anchor: 69, head: 69 });
      await editor.paste();
      await expect(editor).toMatchDocument(
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
              td({ colspan: 1, rowspan: 1 })(p('paragraph1'), p('paragraph2')),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p(),
          p('paragraph1'),
          p('paragraph2'),
        ),
      );
    });

    test('when selecting multiple paragraphs in a table cell and paste in another cell, should paste only paragraphs', async ({
      editor,
    }) => {
      await editor.selection.set({ anchor: 18, head: 40 });
      await editor.copy();
      await editor.selection.set({ anchor: 44, head: 44 });
      await editor.paste();
      await expect(editor).toMatchDocument(
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
              td({ colspan: 1, rowspan: 1 })(p('paragraph1'), p('paragraph2')),
              td({ colspan: 1, rowspan: 1 })(p('paragraph1'), p('paragraph2')),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
            tr(
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
              td({ colspan: 1, rowspan: 1 })(p()),
            ),
          ),
          p(),
          p(),
        ),
      );
    });
  });
});
