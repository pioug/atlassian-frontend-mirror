import {
  p,
  ul,
  ol,
  li,
  doc,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { PanelType } from '@atlaskit/adf-schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  wrapInListAndJoin,
  wrapInList,
} from '../../../actions/wrap-and-join-lists';

describe('list -> actions -> wrap-and-join-lists', () => {
  describe('wrapInListAndJoin', () => {
    const { bulletList, orderedList } = defaultSchema.nodes;

    it.each<
      [
        string,
        {
          listType: typeof bulletList | typeof orderedList;
          original: DocBuilder;
          expected: DocBuilder;
        },
      ]
    >([
      [
        'should wrap the selection in a list and join with adjacent lists of the same type',
        {
          listType: bulletList,
          original: doc(
            ul(li(p('before'))),
            p('{<}aaa'),
            p('bbb'),
            p('ccc{>}'),
            ul(li(p('after'))),
          ),
          expected: doc(
            ul(
              li(p('before')),
              li(p('{<}aaa')),
              li(p('bbb')),
              li(p('ccc{>}')),
              li(p('after')),
            ),
          ),
        },
      ],
      [
        'should wrap the selection in a list and not join with adjacent lists of different type',
        {
          listType: orderedList,
          original: doc(
            ul(li(p('before'))),
            p('{<}aaa'),
            p('bbb'),
            p('ccc{>}'),
            ul(li(p('after'))),
          ),
          expected: doc(
            ul(li(p('before'))),
            ol(li(p('{<}aaa')), li(p('bbb')), li(p('ccc{>}'))),
            ul(li(p('after'))),
          ),
        },
      ],
    ])('%s', (_name, { listType, original, expected }) => {
      const state = createEditorState(original);
      const { tr } = state;

      wrapInListAndJoin(listType, tr);

      expect(tr).toEqualDocumentAndSelection(expected);
    });
  });

  describe('wrapInList', () => {
    // Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/test/test-commands.js

    const { bulletList, orderedList } = defaultSchema.nodes;

    it.each<
      [
        string,
        {
          listType: typeof bulletList | typeof orderedList;
          original: DocBuilder;
          expected: DocBuilder;
        },
      ]
    >([
      [
        'can wrap a paragraph',
        {
          listType: bulletList,
          original: doc(p('{<>}foo')),
          expected: doc(ul(li(p('{<>}foo')))),
        },
      ],
      [
        'can wrap a nested paragraph',
        {
          listType: orderedList,
          original: doc(
            panel({
              panelType: PanelType.INFO,
            })(p('{<>}foo')),
          ),
          expected: doc(
            panel({
              panelType: PanelType.INFO,
            })(ol(li(p('{<>}foo')))),
          ),
        },
      ],
      [
        'can wrap multiple paragraphs',
        {
          listType: bulletList,
          original: doc(p('foo'), p('ba{<}r'), p('ba{>}z')),
          expected: doc(p('foo'), ul(li(p('ba{<}r')), li(p('ba{>}z')))),
        },
      ],
      [
        "doesn't wrap the first paragraph in a list item",
        {
          listType: bulletList,
          original: doc(ul(li(p('{<>}foo')))),
          expected: doc(ul(li(p('{<>}foo')))),
        },
      ],
      [
        "doesn't wrap the first paragraph in a different type of list item",
        {
          listType: orderedList,
          original: doc(ol(li(p('{<>}foo')))),
          expected: doc(ol(li(p('{<>}foo')))),
        },
      ],
      [
        'does wrap the second paragraph in a list item',
        {
          listType: bulletList,
          original: doc(ul(li(p('foo'), p('{<>}bar')))),
          expected: doc(ul(li(p('foo'), ul(li(p('{<>}bar')))))),
        },
      ],
      [
        'joins with the list item above when wrapping its first paragraph',
        {
          listType: orderedList,
          original: doc(ul(li(p('foo')), li(p('{<>}bar')), li(p('baz')))),
          expected: doc(ul(li(p('foo'), ol(li(p('{<>}bar')))), li(p('baz')))),
        },
      ],
      [
        'only splits items where valid',
        {
          listType: orderedList,
          original: doc(p('{<}one'), ol(li(p('two'))), p('three{>}')),
          expected: doc(
            ol(li(p('{<}one'), ol(li(p('two')))), li(p('three{>}'))),
          ),
        },
      ],
    ])('%s', (_name, { listType, original, expected }) => {
      const state = createEditorState(original);
      const { tr } = state;

      wrapInList(listType)(tr);

      expect(tr).toEqualDocumentAndSelection(expected);
    });
  });
});
