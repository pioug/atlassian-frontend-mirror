import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  code,
  strong,
  emoji,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import textFormattingCursorPlugin from '../../../../plugins/text-formatting/pm-plugins/cursor';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';

type HandleClick = (
  view: EditorView,
  pos: number,
  event: MouseEvent,
) => boolean;
let handleClick: HandleClick = textFormattingCursorPlugin.spec!.props!
  .handleClick!;

describe('text-formatting', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      editorProps: {
        emojiProvider: new Promise(() => {}),
      },
      providerFactory: ProviderFactory.create({
        emojiProvider: new Promise(() => {}),
      }),
    });

  describe('cursor', () => {
    describe('inline-code cursor handling', () => {
      describe('when clicking on the right edge', () => {
        describe('inside the inline-code element', () => {
          it('should add the code mark to the selection', () => {
            const {
              editorView,
              refs: { click },
            } = editor(doc(p('start', code('code{click}'), ' end')));
            const codeDOM = editorView.domAtPos(click - 1).node.parentNode;
            const mouseEvent: any = { target: codeDOM } as Partial<MouseEvent>;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([
              editorView.state.schema.marks.code.create(),
            ]);
          });
        });
        describe('outside the inline-code element', () => {
          it('should not add the code mark to the selection', () => {
            const {
              editorView,
              refs: { click },
            } = editor(doc(p('start', code('code{click}'), ' end')));
            const outsideNodeDOM = editorView.domAtPos(click + 1).node
              .parentNode;
            const mouseEvent: any = { target: outsideNodeDOM } as Partial<
              MouseEvent
            >;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([]);
          });

          it('should preserve the marks from the outside node', () => {
            const {
              editorView,
              refs: { click },
            } = editor(doc(p('start', code('code{click}'), strong(' end'))));
            const outsideNodeDOM = editorView.domAtPos(click + 1).node
              .parentNode;
            const mouseEvent: any = { target: outsideNodeDOM } as Partial<
              MouseEvent
            >;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([
              editorView.state.schema.marks.strong.create(),
            ]);
          });
        });
        describe('at the end of a paragraph', () => {
          it('should not add the code mark to the selection', () => {
            const {
              editorView,
              refs: { click },
            } = editor(doc(p('start', code('code{click}'))));
            const outsideNodeDOM = editorView.domAtPos(click).node;
            const mouseEvent: any = { target: outsideNodeDOM } as Partial<
              MouseEvent
            >;
            expect(handleClick(editorView, click, mouseEvent)).toBe(true);
            expect(editorView.state.storedMarks).toEqual([]);
          });
        });
      });
      describe('when clicking on an adjacent emoji element', () => {
        it('should not add the code mark to the selection', () => {
          const {
            editorView,
            refs: { click },
          } = editor(
            doc(
              p(
                'start',
                code('code'),
                '{click}',
                emoji({ shortName: ':flag_bo:', text: '🇧🇴' })(),
              ),
            ),
          );
          const outsideNodeDOM = editorView.domAtPos(click + 1).node;
          const mouseEvent: any = { target: outsideNodeDOM } as Partial<
            MouseEvent
          >;
          expect(handleClick(editorView, click, mouseEvent)).toBe(false);
          expect(editorView.state.storedMarks).toEqual(null);
        });
      });
    });
    describe('when clicking on the left edge', () => {
      describe('inside the inline-code element', () => {
        it('should add the code mark to the selection', () => {
          const {
            editorView,
            refs: { click },
          } = editor(doc(p('start', code('{click}code'), ' end')));
          const codeDOM = editorView.domAtPos(click + 1).node.parentNode;
          const mouseEvent: any = { target: codeDOM } as Partial<MouseEvent>;
          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([
            editorView.state.schema.marks.code.create(),
          ]);
        });
      });
      describe('outside the inline-code element', () => {
        it('should not add the code mark to the selection', () => {
          const {
            editorView,
            refs: { click },
          } = editor(doc(p('start{click}', code('code'), ' end')));
          const outsideNodeDOM = editorView.domAtPos(click - 1).node.parentNode;
          const mouseEvent: any = { target: outsideNodeDOM } as Partial<
            MouseEvent
          >;

          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([]);
        });

        it('should preserve the marks from the outside node', () => {
          const {
            editorView,
            refs: { click },
          } = editor(doc(p(strong('start{click}'), code('code'), ' end')));
          const outsideNodeDOM = editorView.domAtPos(click - 1).node.parentNode;
          const mouseEvent: any = { target: outsideNodeDOM } as Partial<
            MouseEvent
          >;
          expect(handleClick(editorView, click, mouseEvent)).toBe(true);
          expect(editorView.state.storedMarks).toEqual([
            editorView.state.schema.marks.strong.create(),
          ]);
        });
      });
    });
  });
});
