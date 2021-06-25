import { Slice, Fragment } from 'prosemirror-model';
import {
  doc,
  p,
  ol,
  ul,
  li,
  panel,
  code_block,
  hr,
  h1,
  expand,
  nestedExpand,
  table,
  hr as rule,
  tr,
  td,
  hardBreak,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';

import { insertSliceForLists as insertSlice } from '../../../edge-cases';

describe('paste list', () => {
  const case0: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a empty panel',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
      ),
    ),
  ];

  const case1: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is the start of paragraph',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}Hello'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
        p('Hello'),
      ),
    ),
  ];

  const case2: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is the end of paragraph',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('Hello{<>}'),
      ),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('Hello'),
        ul(li(p('A{<>}'))),
      ),
    ),
  ];

  const case3: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is the start of paragraph',
    'paste content has a nested list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}Hello'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(li(p('B{>}'))),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('A'),
            ul(li(p('B{<>}'))),
          ),
        ),
        p('Hello'),
      ),
    ),
  ];

  const case4: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is the end of paragraph',
    'paste content has a nested list',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('Hello{<>}'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(li(p('B{>}'))),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('Hello'),
        ul(
          li(
            p('A'),
            ul(li(p('B{<>}'))),
          ),
        ),
      ),
    ),
  ];

  const case5: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a empty panel selected by node selection',
    'paste content has a simple list',
    // Destination
    // prettier-ignore
    doc(
      '{<node>}',
      panel()(p()),
    ),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(li(p('A{<>}'))),
      ),
    ),
  ];

  const case6: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'the document is empty',
    'paste content has a simple list',
    // Destination
    doc(p()),
    // Pasted Content
    doc('{<}', ul(li(p('A{>}')))),
    // Expected Document
    // prettier-ignore
    doc(
      ul(li(p('A{<>}'))),
    ),
  ];

  const case7: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection over two nested list items',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('C{>}')),
            li(p('D')),
          ),
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('D')),
          ),
        ),
      ),
    ),
  ];

  const case8: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection over two nested list items',
    'paste content is a nested bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(p('C{>}')),
            li(p('D')),
          ),
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(
          p('baz'),
          ul(li(p('D')))
        ),
      ),
    ),
  ];

  const case9: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection at the start of an empty list item',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('{<>}')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(
          p('baz'),
        )
      ),
    ),
  ];

  const case10: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection at the start of an empty list item',
    'paste content is a text from a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('{<>}')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(p('foo')),
        li(
          p('bar'),
          ul(
            li(p('1 {<}- test{>}')),
            li(p('2')),
            li(p('3')),
          ),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('B'),
          ul(
            li(p('C')),
            li(p('D')),
          ),
        ),
        li(p('- test')),
      ),
    ),
  ];

  const case11: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across two levels of list item and has nested children',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1{>}'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(
              p('B2'),
              ul(
                li(
                  p('B3')
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case12: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across two levels of list item and has nested children',
    'paste content is a bullet list with a code block in a list item',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1{>}'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('foo'),
          code_block({})('test')
        ),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('foo'),
          code_block({})('test')
        ),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(
              p('B2'),
              ul(
                li(
                  p('B3')
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case13: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across three levels of list item and has nested children',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2{>}'),
                  ul(
                    li(
                      p('B3')
                      ),
                  ),
                  ),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B3')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case14: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across three levels of list item and the last item has a sibling thats unselected',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(p('B2{>}')),
                li(p('B3')),
                li(p('B4')),
              ),
              ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B3')),
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case15: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across four levels of list item and the last item has a sibling thats unselected',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(p('B3{>}')),
                    li(p('B4')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case16: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across four levels of list item, has an empty list item sibling',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(p('B3{>}')),
                    li(p('')),
                    li(p('B4')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(p('{<}foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz'),
          ul(
            li(p('')),
            li(p('B4')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case17: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel node',
    'paste content is a paragraph, followed by a divider, then a list',
    // Destination
    // prettier-ignore
    doc(
      panel()(p('{<>}')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      p('{<}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('hello')),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{<>}')),
      ),
    ),
  ];

  const case18: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel node, selection is a ghost selection caused by right clicking to paste which ends in the next node',
    'paste content is a paragraph, followed by a divider, then a list',
    // Destination
    // prettier-ignore
    doc(
      panel()(p('{<}')),
      p('{>}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      p('{<}hello'),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(p('hello')),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{<>}hello')),
      ),
      hr(),
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case19: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is the start of an empty paragraph after a divider and a list item, the selection is followed by empty paragraphs',
    'paste content is list item directly after a divider',
    // Destination
    // prettier-ignore
    doc(
      hr(),
      ul(
        li(p('A')),
      ),
      p(''),
      p('{<>}'),
      p(''),
      p(''),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      hr(),
      '{<}',
      ul(li(p('A{>}'))),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      hr(),
      ul(
        li(p('A')),
      ),
      p(''),
      ul(
        li(p('A{<>}')),
      ),
      p(''),
      p(''),
    ),
  ];

  const case20: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty list item at the end of a nested list, with an empty parent list item',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('X')),
        li(
          p(''),
          ul(
            li(p('Y')),
            li(p('{<>}'))
          )
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('X')),
        li(
          p(),
          ul(
            li(p('Y')),
            li(p('A')),
            li(p('B')),
            li(p('C')),
          )
        ),
      ),
    ),
  ];

  const case21: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside a table cell',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(p('A')),
                li(p('B')),
                li(p('C{<>}'))
              ),
            )
          )
        )
      )
    ),
  ];

  const case22: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty expand inside a table cell',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('A'),
            ),
            ul(
              li(p('B')),
              li(p('C{<>}'))
            ),
          )
        )
      )
    ),
  ];

  const case23: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty expand',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      expand()(p('')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        ul(
          li(p('A')),
          li(p('B')),
          li(p('C{<>}'))
        ),
      ),
    ),
  ];

  const case24: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside an expand',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      expand()(
        panel()(
          p('')
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('A')),
        li(p('B')),
        li(p('C{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        panel()(
          ul(
            li(p('A')),
            li(p('B')),
            li(p('C{<>}'))
          ),
        )
      ),
    ),
  ];

  const case25: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside a table cell',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(
                  p('A'),
                  ul(
                    li(
                      p('B'),
                      ul(
                        li(p('C{<>}')),
                      ),
                    ),
                  ),
                ),
              ),
            )
          )
        )
      )
    ),
  ];

  const case26: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty expand inside a table cell',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            nestedExpand({ title: "" })(
              p('A'),
            ),
            ul(
              li(
                p('B'),
                ul(
                  li(
                    p('C{<>}'),
                  ),
                ),
              ),
            ),
          )
        )
      )
    ),
  ];

  const case27: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty expand',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      expand()(p('')),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        ul(
          li(
            p('A'),
            ul(
              li(
                p('B'),
                ul(
                  li(p('C{<>}')),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ];

  const case28: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside an expand',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      expand()(
        panel()(
          p('')
        ),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('A'),
          ul(
            li(
              p('B'),
              ul(
                li(p('C{>}')),
              ),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      expand()(
        panel()(
          ul(
            li(
              p('A'),
              ul(
                li(
                  p('B'),
                  ul(
                    li(p('C{<>}')),
                  ),
                ),
              ),
            ),
          ),
        )
      ),
    ),
  ];

  const case29: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across two separate lists',
    'paste content is single level list',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('{<}B1'),
              ol(
                li(p('B2')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
      p(''),
      ul(
        li(p('foo{>}')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('the')),
        li(p('pasted')),
        li(p('list{>}')),
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(p('the')),
            li(p('pasted')),
            li(p('list{<>}')),
          ),
        ),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case30: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across two separate lists',
    'paste content is nested list',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('{<}B1'),
              ol(
                li(p('B2')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
      p(''),
      ul(
        li(p('foo{>}')),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz{>}')),
              )
            ),
          ),
        ),
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('B'),
          ol(
            li(
              p('qux'),
              ul(
                li(
                  p('quux'),
                  ul(
                    li(p('quuz{>}')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('bar')),
        li(p('baz')),
      ),
    ),
  ];

  const case31: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a nested list',
    'paste content contains two separate lists',
    // Destination
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('{<}B'),
          ol(
            li(
              p('B1'),
              ol(
                li(p('B2{>}')),
                li(p('B3')),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz')),
              )
            ),
          ),
        ),
      ),
      p(''),
      ol(
        li(
          p('foo'),
          ol(li(p('bar')))
        ),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ol(
        li(p('A')),
        li(
          p('qux'),
          ul(
            li(
              p('quux'),
              ul(
                li(p('quuz')),
              )
            ),
          ),
        ),
      ),
      p(''),
      ol(
        li(
          p('foo'),
          ol(li(p('bar')))
        ),
        li(
          p('baz{<>}'),
          ol(li(p('B3'))),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case32: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty paragraph',
    'paste content is a nested list item across two levels',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar'),
              ul(
                li(p('baz{>}')),
              )
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar'),
          ul(
            li(p('baz{<>}')),
          )
        ),
      ),
    ),
  ];

  const case33: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty paragraph',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar{>}'),
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar{<>}'),
        ),
      ),
    ),
  ];

  const case34: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty paragraph',
    'paste content is a single nested list item, which has a nested child',
    // Destination
    // prettier-ignore
    doc(
      p('{<>}'),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(
            li(
              p('bar{>}'),
              ul(
                li(
                  p('baz')
                )
              )
            ),
          ),
        ),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(
          p('bar{<>}'),
        ),
      ),
    ),
  ];

  const case35: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel selected by node selection',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      '{<node>}',
      panel()(p()),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(li(p('bar{>}'))),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('bar{<>}'),
          ),
        ),
      )
    ),
  ];

  const case36: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel',
    'paste content is a single nested list item',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}'),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(
          p('foo'),
          '{<}',
          ul(li(p('bar{>}'))),
        ),
        li(p('baz'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('bar{<>}'),
          ),
        ),
      )
    ),
  ];

  const case37: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across four levels of list item and ends midway through a list item',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B{>}2'),
                  ul(
                    li(p('B3')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(
          p('baz2'),
          ul(
            li(p('B3')),
            ),
        ),
        li(p('C')),
      ),
    ),
  ];

  const case38: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is a selection across four levels of list item and last list item contains an extra unselected paragraph',
    'paste content is a bullet list',
    // Destination
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(
          p('{<}B'),
          ul(
            li(
              p('B1'),
              ul(
                li(
                  p('B2'),
                  ul(
                    li(
                      p('B3{>}', hardBreak(), 'B4'),
                    ),
                    li(p('B5')),
                  )
                ),
              ),
            ),
          ),
        ),
        li(p('C')),
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      '{<}',
      ul(
        li(p('foo')),
        li(p('bar')),
        li(p('baz{>}')),
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      ul(
        li(p('A')),
        li(p('foo')),
        li(p('bar')),
        li(p('baz', hardBreak(), 'B4')),
        li(p('B5')),
        li(p('C')),
      ),
    ),
  ];

  const case39: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel node',
    'paste content is a bullet list and a selection of the sublist',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}')
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('foo')),
          li(p('{<}bar')),
          li(p('baz{>}')),
        )
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('bar')),
          li(p('baz{<>}')),
        )
      )
    ),
  ];

  const case40: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel node',
    'paste content is nested list and the selection is a sublist',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}')
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      panel()
        (ul(
          li(
            p('a'),
            ul(
              li(
                p('{<}b'),
                ul(
                  li(p('c{>}'))
                )
              )
            )
          )
          )
        )),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(
            p('b'),
            ul(
              li(p('c{<>}'))
            )
          )
        )
      )
    ),
  ];

  const case41: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel node',
    'paste content is a paragraph, header and list and paragraph',
    // Destination
    // prettier-ignore
    doc(
      panel()(
        p('{<>}')
      ),
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      panel()(
        p('{<}start'),
        h1('H1'),
        ul(
          li(p('a')),
          li(p('b'))
        ),
        p('end{>}')
      )
    ),
    // Expected Document
    // prettier-ignore
    doc(
      panel()(
        p('start'),
        h1('H1'),
        ul(
          li(p('a')),
          li(p('b'))
        ),
        p('end{<>}')
      )
    ),
  ];

  const case42: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside a table cell',
    'paste content is a sub list of a single level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      ul(
        li(p('a')),
        li(p('{<}b')),
        li(p('c{>}'))
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(p('b')),
                li(p('c{<>}'))
              ),
            )
          )
        )
      )
    ),
  ];

  const case43: [string, string, DocBuilder, DocBuilder, DocBuilder] = [
    'destination is an empty panel inside a table cell',
    'paste content is a sub list of a 2-level list',
    // Destination
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              p('{<>}')
            )
          )
        )
      )
    ),
    // Pasted Content
    // prettier-ignore
    doc(
      panel()(
        ul(
          li(p('a'),
            ul(
              li(p('{<}b'),
                ul(
                  li(p('c{>}'))
                )
              )
            )
          )
        )
      ),
    ),
    // Expected Document
    // prettier-ignore
    doc(
      table()(
        tr(
          td()(
            panel()(
              ul(
                li(p('b'),
                  ul(
                    li(p('c{<>}'))
                  )
                )
              )
            )
          )
        )
      )
    ),
  ];

  describe.each<[string, string, DocBuilder, DocBuilder, DocBuilder]>([
    case0,
    case1,
    case2,
    case3,
    case4,
    case5,
    case6,
    case7,
    case8,
    case9,
    case10,
    case11,
    case12,
    case13,
    case14,
    case15,
    case16,
    case17,
    case18,
    case19,
    case20,
    case21,
    case22,
    case23,
    case24,
    case25,
    case26,
    case27,
    case28,
    case29,
    case30,
    case31,
    case32,
    case33,
    case34,
    case35,
    case36,
    case37,
    case38,
    case39,
    case40,
    case41,
    case42,
    case43,
  ])(
    '[case%#] when %s and %s',
    (
      _scenarioDest,
      _scenarioContent,
      destinationDocument,
      pasteContent,
      expectedDocument,
    ) => {
      it('should match the expected document and selection', () => {
        const destinationState = createEditorState(destinationDocument);
        const pasteOriginState = createEditorState(pasteContent);
        const pasteSlice = pasteOriginState.doc.slice(
          pasteOriginState.selection.from,
          pasteOriginState.selection.to,
          // @ts-ignore
          true,
        );
        const { tr } = destinationState;
        insertSlice({ tr, slice: Slice.maxOpen(pasteSlice.content, false) });
        expect(tr).toEqualDocumentAndSelection(expectedDocument(defaultSchema));
        expect(() => {
          tr.doc.check();
        }).not.toThrow();
      });
    },
  );

  describe('when the paste content is slice', () => {
    const sliceCase01: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is an empty paragraph before a rule',
      'cursor should stay inside of the list item pasted',
      // Destination
      // prettier-ignore
      doc(
        p('Hello'),
        p(''),
        p('{<>}'),
        rule(),
        p('LOKO'),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p('foolol'),
            ),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        p('Hello'),
        p(''),
        ul(
          li(
            p('foolol{<>}'),
          ),
        ),
        rule(),
        p('LOKO'),
      ),
    ];

    const sliceCase02: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the middle of a list item',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd {<>} 1234'),
          ),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p('ROMA'),
            ),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd ROMA{<>} 1234'),
          ),
        ),
      ),
    ];

    const sliceCase03: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the start of a list item',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(
            p('{<>}abcd 1234'),
          ),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p('ROMA '),
            ),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('ROMA {<>}abcd 1234'),
          ),
        ),
      ),
    ];

    const sliceCase04: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the end of a list item',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd 1234{<>}'),
          ),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p('ROMA '),
            ),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd 1234ROMA {<>}'),
          ),
        ),
      ),
    ];

    const sliceCase05: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is a range selection in the middle of the list item',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd{<} {>}1234'),
          ),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p(' ROMA '),
            ),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('abcd ROMA {<>}1234'),
          ),
        ),
      ),
    ];

    const sliceCase06: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is a range selection by two list items',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(p('hello {<}world')),
          li(p('xxx{>}x')),
          li(p('yyyy')),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(p('12345')),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(p('hello 12345{<>}x')),
          li(p('yyyy')),
        ),
      ),
    ];

    const sliceCase07: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is a range selection by two nested lists',
      'cursor should stay at the end of the content added',
      // Destination
      // prettier-ignore
      doc(
        ul(
          li(
            p('aaaa'),
            ul(
              li(
                p('bb{<}bb'),
                ul(
                  li(p('cc{>}cc')),
                ),
              ),
            ),
          ),
        ),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(p('12345')),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('aaaa'),
            ul(
              li(
                p('bb12345{<>}cc'),
              ),
            ),
          ),
        ),
      ),
    ];

    const sliceCase08: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the first position of paragraph',
      'cursor should go to the end of list',
      // Destination
      // prettier-ignore
      doc(
        p('{<>}LOKA'),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(p('12345')),
            li(p('67890')),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(p('12345')),
          li(p('67890{<>}')),
        ),
        p('LOKA'),
      ),
    ];

    const sliceCase09: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the first position of paragraph',
      'cursor should go to the end of the nested list',
      // Destination
      // prettier-ignore
      doc(
        p('{<>}LOKA'),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(
              p('12345'),
              ul(
                li(
                  p('67890'),
                  ul(
                    li(p('DEEP')),
                  ),
                ),
              ),
            ),
          )(sampleSchema),
        ),
        3,
        7
      ),
      // Expected Document
      // prettier-ignore
      doc(
        ul(
          li(
            p('12345'),
            ul(
              li(
                p('67890'),
                ul(
                  li(p('DEEP{<>}')),
                ),
              ),
            ),
          ),
        ),
        p('LOKA'),
      ),
    ];

    const sliceCase10: [string, string, DocBuilder, Slice, DocBuilder] = [
      'destination is the first position of paragraph inside of expand',
      'cursor should go to at then end of the list',
      // Destination
      // prettier-ignore
      doc(
        expand()(
          p('{<>}LOKA'),
        ),
        p('ROMA'),
      ),
      // Pasted Content
      // prettier-ignore
      new Slice(
        Fragment.from(
          ul(
            li(p('12345')),
            li(p('67890')),
          )(sampleSchema),
        ),
        3,
        3
      ),
      // Expected Document
      // prettier-ignore
      doc(
        expand()(
          ul(
            li(p('12345')),
            li(p('67890{<>}')),
          ),
          p('LOKA'),
        ),
        p('ROMA'),
      ),
    ];

    describe.each<[string, string, DocBuilder, Slice, DocBuilder]>([
      sliceCase01,
      sliceCase02,
      sliceCase03,
      sliceCase04,
      sliceCase05,
      sliceCase06,
      sliceCase07,
      sliceCase08,
      sliceCase09,
      sliceCase10,
    ])(
      '[sliceCase%#] when %s and %s',
      (
        _scenarioDest,
        _scenarioContent,
        destinationDocument,
        slicePasted,
        expectedDocument,
      ) => {
        const destinationState = createEditorState(destinationDocument);
        const { tr } = destinationState;
        insertSlice({ tr, slice: slicePasted });

        it('should match the expected document and selection', () => {
          expect(tr).toEqualDocumentAndSelection(
            expectedDocument(defaultSchema),
          );
        });

        it('should create a valid document', () => {
          expect(() => {
            tr.doc.check();
          }).not.toThrow();
        });
      },
    );
  });
});
