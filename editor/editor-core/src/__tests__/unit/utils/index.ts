import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';

import {
  doc,
  code_block,
  code,
  p,
  strong,
  panel,
  blockquote,
  h1,
  ul,
  ol,
  li,
  taskList,
  taskItem,
  decisionList,
  decisionItem,
  media,
  mediaGroup,
  mediaSingle,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
import { toggleMark } from 'prosemirror-commands';

import {
  isMarkTypeAllowedInCurrentSelection,
  areBlockTypesDisabled,
  isEmptyNode,
  dedupe,
  compose,
  pipe,
  isSelectionInsideLastNodeInDocument,
  shallowEqual,
} from '../../../utils';
import { Node, Schema } from 'prosemirror-model';
import { closestElement } from '../../../utils/dom';

describe('@atlaskit/editore-core/utils', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        media: {
          allowMediaSingle: true,
        },
        allowPanel: true,
        allowTasksAndDecisions: true,
        mentionProvider: Promise.resolve(new MockMentionResource({})),
      },
    });

  describe('#closest', () => {
    it('return first parentNode using query selector', () => {
      const divSecondary = document.createElement('div');
      divSecondary.setAttribute('id', 'secondary');

      const div = document.createElement('div');
      div.setAttribute('id', 'primary');
      div.appendChild(divSecondary);
      document.body.appendChild(div);

      const result = closestElement(divSecondary, '#primary');
      expect(result).toEqual(div);
      div.remove();
    });
  });

  describe('#isMarkTypeAllowedInCurrentSelection', () => {
    describe('when the current node supports the given mark type', () => {
      describe('and a stored mark is present', () => {
        it('returns true if given mark type is not excluded', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const { typeAheadQuery, strong } = editorView.state.schema.marks;
          toggleMark(strong)(editorView.state, editorView.dispatch);

          let result = isMarkTypeAllowedInCurrentSelection(
            typeAheadQuery,
            editorView.state,
          );
          expect(result).toBe(true);
        });

        it('returns false if given mark type is excluded', () => {
          const { editorView } = editor(doc(p('{<>}')));
          const { typeAheadQuery, code } = editorView.state.schema.marks;
          toggleMark(code)(editorView.state, editorView.dispatch);

          let result = isMarkTypeAllowedInCurrentSelection(
            typeAheadQuery,
            editorView.state,
          );
          expect(result).toBe(false);
        });
      });

      describe('without a stored mark present', () => {
        describe('and the selection is empty', () => {
          it('returns true if given mark type not excluded', () => {
            const { editorView } = editor(doc(p(strong('te{<>}xt'))));
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if given mark type is excluded', () => {
            const { editorView } = editor(doc(p(code('te{<>}xt'))));
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });
        });

        describe('and a non-empty selection', () => {
          it('returns false if mark type is allowed at the start of the selection', () => {
            const { editorView } = editor(
              doc(p(strong('t{<}e'), code('xt{>}'))),
            );
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });

          it('returns true if the selection starts at the end of an excluded mark type', () => {
            const { editorView } = editor(
              doc(p(code('te{<}'), strong('xt{>}'))),
            );
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if mark type is excluded at the start of the selection', () => {
            const { editorView } = editor(
              doc(p(code('t{<}e'), strong('xt{>}'))),
            );
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });

          it('returns true if the selection ends at the start of an excluded mark type', () => {
            const { editorView } = editor(
              doc(p(strong('{<}te'), code('{>}xt'))),
            );
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(true);
          });

          it('returns false if the selection includes an excluded node', () => {
            const { editorView } = editor(
              doc(p(strong('{<}text'), code('text'), strong('text{>}'))),
            );
            const { typeAheadQuery } = editorView.state.schema.marks;

            let result = isMarkTypeAllowedInCurrentSelection(
              typeAheadQuery,
              editorView.state,
            );
            expect(result).toBe(false);
          });
        });
      });
    });

    describe('when the current node does not support the given mark type', () => {
      it('returns false', () => {
        const { editorView } = editor(doc(code_block()('te{<>}xt')));
        const { typeAheadQuery } = editorView.state.schema.marks;

        let result = isMarkTypeAllowedInCurrentSelection(
          typeAheadQuery,
          editorView.state,
        );
        expect(result).toBe(false);
      });
    });
  });

  describe('#areBlockTypesDisabled', () => {
    it('should return true is selection has a blockquote', () => {
      const { editorView } = editor(
        doc(blockquote(p('te{<}xt')), panel()(p('te{>}xt'))),
      );
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(true);
    });

    it('should return false is selection has no blockquote', () => {
      const { editorView } = editor(doc(p('te{<}xt'), panel()(p('te{>}xt'))));
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(false);
    });

    it('should return true if selection has action item', () => {
      const { editorView } = editor(
        doc(
          taskList({ localId: 'local-uuid' })(
            taskItem({ localId: 'local-uuid', state: 'TODO' })('Action {<>}'),
          ),
        ),
      );
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(true);
    });

    it('should return true if selection has decision', () => {
      const { editorView } = editor(
        doc(
          decisionList({ localId: 'local-uuid' })(
            decisionItem({ localId: 'local-uuid', state: 'TODO' })(
              'Decision {<>}',
            ),
          ),
        ),
      );
      const result = areBlockTypesDisabled(editorView.state);
      expect(result).toBe(true);
    });
  });

  describe('#isEmptyNode', () => {
    const { editorView } = editor(doc(p('')));
    const checkEmptyNode = (node: (schema: Schema<any>) => Node) =>
      isEmptyNode(editorView.state.schema)(node(editorView.state.schema));

    it('should return true for empty paragraph', () => {
      expect(checkEmptyNode(p())).toBeTruthy();
    });
    it('should return false for non-empty paragraph', () => {
      expect(checkEmptyNode(p('x'))).toBeFalsy();
    });
    it('should return false for invisible content', () => {
      expect(checkEmptyNode(p('\u200c'))).toBeFalsy();
    });

    it('should return true for empty codeBlock', () => {
      expect(checkEmptyNode(code_block()())).toBeTruthy();
    });
    it('should return false for non-empty codeBlock', () => {
      expect(checkEmptyNode(code_block()('var x = 1;'))).toBeFalsy();
    });

    it('should return true for empty heading', () => {
      expect(checkEmptyNode(h1())).toBeTruthy();
    });
    it('should return false for non-empty heading', () => {
      expect(checkEmptyNode(h1('Hello!'))).toBeFalsy();
    });

    it('should return true for empty blockquote', () => {
      expect(checkEmptyNode(blockquote(p()))).toBeTruthy();
    });
    it('should return false for non-empty blockquote', () => {
      expect(checkEmptyNode(blockquote(p('Hello! - A')))).toBeFalsy();
    });

    it('should return true for empty panel', () => {
      expect(checkEmptyNode(panel()(p('')))).toBeTruthy();
    });
    it('should return false for non-empty panel', () => {
      expect(checkEmptyNode(panel()(p('Hello! - A')))).toBeFalsy();
    });

    it('should return true for empty unordered list', () => {
      expect(checkEmptyNode(ul(li(p())))).toBeTruthy();
    });
    it('should return false for non-empty unordered', () => {
      expect(checkEmptyNode(ul(li(p('A'))))).toBeFalsy();
    });

    it('should return true for empty ordered list', () => {
      expect(checkEmptyNode(ol(li(p())))).toBeTruthy();
    });
    it('should return false for non-empty ordered', () => {
      expect(checkEmptyNode(ol(li(p('1'))))).toBeFalsy();
    });

    it('should return true for empty task list', () => {
      expect(checkEmptyNode(taskList()(taskItem()('')))).toBeTruthy();
    });
    it('should return false for non-empty task list', () => {
      expect(checkEmptyNode(taskList()(taskItem()('do it!')))).toBeFalsy();
    });

    it('should return true for empty decision list', () => {
      expect(checkEmptyNode(decisionList()(decisionItem()('')))).toBeTruthy();
    });
    it('should return false for non-empty decision list', () => {
      expect(
        checkEmptyNode(decisionList()(decisionItem()('done!'))),
      ).toBeFalsy();
    });

    it('should return false for any mediaGroup', () => {
      expect(
        checkEmptyNode(
          mediaGroup(media({ id: '123', type: 'file', collection: 'test' })()),
        ),
      ).toBeFalsy();
    });
    it('should return false for any mediaSingle', () => {
      expect(
        checkEmptyNode(
          mediaSingle()(
            media({ id: '123', type: 'file', collection: 'test' })(),
          ),
        ),
      ).toBeFalsy();
    });

    it('should return true for empty doc', () => {
      expect(checkEmptyNode(doc(p('')))).toBeTruthy();
    });
    it('should return true for empty doc with empty panel', () => {
      expect(checkEmptyNode(doc(panel()(p(''))))).toBeTruthy();
    });
    it('should return true for empty doc with empty heading', () => {
      expect(checkEmptyNode(doc(panel()(h1())))).toBeTruthy();
    });
    it('should return true for empty doc with multiple empty blocks', () => {
      expect(
        checkEmptyNode(
          doc(panel()(p('')), h1(), code_block()(), ul(li(p('')))),
        ),
      ).toBeTruthy();
    });

    it('should return false for non-empty doc', () => {
      expect(checkEmptyNode(doc(p('hello')))).toBeFalsy();
    });
    it('should return false for non-empty doc', () => {
      expect(checkEmptyNode(doc(p(''), h1('Hey!')))).toBeFalsy();
    });
    it('should return false for non-empty doc with multiple empty blocks', () => {
      expect(
        checkEmptyNode(
          doc(p('?'), panel()(p('')), h1(), code_block()(), ul(li(p()))),
        ),
      ).toBeFalsy();
    });

    it('should throw for unknown nodes', () => {
      expect(
        checkEmptyNode(
          (() =>
            ({
              type: {
                name: 'unknown',
              },
            } as any)) as any,
        ),
      ).toBeTruthy();
    });
  });

  describe('#dedupe', () => {
    it('should always return a new list', () => {
      const l1: Array<string> = [];
      const l2: Array<string> = ['a'];
      const l3: Array<string> = ['a', 'a'];
      expect(dedupe(l1) !== l1).toBeTruthy();
      expect(dedupe(l2) !== l2).toBeTruthy();
      expect(dedupe(l3) !== l3).toBeTruthy();
      expect(l3.length).toEqual(2);
    });

    it('should dedupe string', () => {
      const l = ['a', 'c', 'a', 'b'];
      expect(dedupe(l)).toEqual(['a', 'c', 'b']);
    });

    it('should dedupe numbers', () => {
      const l = [1, 2, 5, 6, 3, 23, 1, 6, 2];
      expect(dedupe(l)).toEqual([1, 2, 5, 6, 3, 23]);
    });

    it('should dedupe objects', () => {
      const o1 = {};
      const o2 = {};
      const l = [o1, o1, o2, o2];
      expect(dedupe(l)).toEqual([o1, o2]);
    });

    it('should dedupe list using an iteratee', () => {
      const l = [
        { item: 'Activity Stream', keywords: ['gadget'] },
        { item: 'Activity Stream', keywords: ['gadget'] },
        { item: 'Agile Wallboard Gadget', keywords: ['gadget'] },
        { item: 'Assigned to Me', keywords: ['gadget'] },
        { item: 'Attachments', keywords: ['attachments'] },
        { item: 'Average Age Chart', keywords: ['gadget'] },
        { item: 'Average Number of Times in Status', keywords: ['gadget'] },
        { item: 'Average Time in Status', keywords: ['gadget'] },
        {
          item: 'Better Code Block',
          keywords: ['paste-code-macro', 'codebetter', 'bettercode', 'bcode'],
        },
        {
          item: 'Blog Posts',
          keywords: [
            'blog-posts',
            'news',
            'blogs',
            'blogposts',
            'blogpost',
            'blog',
            'blog-post',
          ],
        },
        {
          item: 'Better Code Block',
          keywords: ['different'],
        },
      ];

      const deduped = [
        { item: 'Activity Stream', keywords: ['gadget'] },
        { item: 'Agile Wallboard Gadget', keywords: ['gadget'] },
        { item: 'Assigned to Me', keywords: ['gadget'] },
        { item: 'Attachments', keywords: ['attachments'] },
        { item: 'Average Age Chart', keywords: ['gadget'] },
        { item: 'Average Number of Times in Status', keywords: ['gadget'] },
        { item: 'Average Time in Status', keywords: ['gadget'] },
        {
          item: 'Better Code Block',
          keywords: ['paste-code-macro', 'codebetter', 'bettercode', 'bcode'],
        },
        {
          item: 'Blog Posts',
          keywords: [
            'blog-posts',
            'news',
            'blogs',
            'blogposts',
            'blogpost',
            'blog',
            'blog-post',
          ],
        },
      ];

      expect(dedupe(l, (item) => item.item)).toEqual(deduped);
    });
  });

  describe('#pipe', () => {
    it('pipes functions', () => {
      const fn1 = (val: string) => `fn1(${val})`;
      const fn2 = (val: string) => `fn2(${val})`;
      const fn3 = (val: string) => `fn3(${val})`;

      const pipedFunction = pipe(fn1, fn2, fn3);

      expect(pipedFunction('inner')).toBe('fn3(fn2(fn1(inner)))');
    });

    it('pipes functions with different initial type', () => {
      const fn1 = (val: string, num: number) => `fn1(${val}-${num})`;
      const fn2 = (val: string) => `fn2(${val})`;
      const fn3 = (val: string) => `fn3(${val})`;
      const pipedFunction = pipe(fn1, fn2, fn3);

      expect(pipedFunction('inner', 2)).toBe('fn3(fn2(fn1(inner-2)))');
    });

    it('pipes functions with different return value', () => {
      const fn1 = (val: string) => Number.parseInt(val, 10);
      const fn2 = (val: number) => ({ number: val, string: val.toString() });
      const fn3 = (val: object) => `fn3(${JSON.stringify(val)})`;

      const pipedFunction = pipe(fn1, fn2, fn3);

      expect(pipedFunction('2')).toBe('fn3({"number":2,"string":"2"})');
    });
  });

  describe('#compose', () => {
    it('should compose functions right to left', () => {
      const f1 = (a: string) => `#${a}`;
      const f2 = (b: string) => `!${b}`;

      expect(compose(f1, f2)('test')).toEqual('#!test');
    });
  });

  describe('#isSelectionInsideLastNodeInDocument', () => {
    it('should detect selection is inside last node in document', () => {
      const { editorView } = editor(
        doc(p('First Element'), p('{<>}Last Element')),
      );

      expect(
        isSelectionInsideLastNodeInDocument(editorView.state.selection),
      ).toBe(true);
    });
    it('should detect selection is not inside last element in the document', () => {
      const { editorView } = editor(
        doc(p('{<>}First Element'), p('Last Element')),
      );

      expect(
        isSelectionInsideLastNodeInDocument(editorView.state.selection),
      ).toBe(false);
    });
  });

  describe('#shallowEqual', () => {
    it('should return true if all props from obj1 equals obj2', () => {
      const objA = { test: 'ok', num: 2, prop: 'xx' };
      const objB = { test: 'ok', num: 2, prop: 'xx' };

      expect(shallowEqual(objA, objB)).toBe(true);
    });

    it('should return false if one prop from obj2 differs from obj1', () => {
      const objA = { test: 'ok', num: 2, prop: 'xx' };
      const objB = { test: 'ok', num: 2, prop: 'xx2' };

      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it('should return false if obj2 has nested properties', () => {
      const objA = { test: 'ok', num: 2, prop: { sub: 'ok' } };
      const objB = { test: 'ok', num: 2, prop: { sub: 'ok' } };

      expect(shallowEqual(objA, objB)).toBe(false);
    });

    it('should return false if obj2 has different number of keys', () => {
      const objA = { test: 'ok' };
      const objB = { test: 'ok', num: 2, prop: { sub: 'ok' } };

      expect(shallowEqual(objA, objB)).toBe(false);
    });
  });
});
