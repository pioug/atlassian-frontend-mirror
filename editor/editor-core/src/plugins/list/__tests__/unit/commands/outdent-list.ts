import {
  doc,
  ul,
  ol,
  li,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  UIAnalyticsEvent,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { outdentList } from '../../../commands/outdent-list';
import analyticsPlugin, { INPUT_METHOD } from '../../../../analytics';
import listPlugin from '../../..';

describe('lists plugin -> commands -> outdentList', () => {
  const createProseMirrorEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  beforeEach(() => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
  });

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add(listPlugin)
      .add([analyticsPlugin, { createAnalyticsEvent }]);

    return createProseMirrorEditor({
      doc,
      preset,
    });
  };

  describe('#outdentList', () => {
    describe('when outdent from a nested list item', () => {
      it('should keep the list item at the right level', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(p('A')),
            li(
              p('B'),
              ol(
                li(p('{<>}B1')),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected =doc(
          ol(
            li(p('A')),
            li(p('B')),
            li(p('B1')),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    describe('when outdent from a nested mixed list', () => {
      it('should keep the list type from the target list', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(p('A')),
            li(
              p('B'),
              ul(
                li(p('{<>}B1')),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected = doc(
          ol(
            li(p('A')),
            li(p('B')),
            li(p('B1')),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    describe('when outdent the first list item with a mixed nested list', () => {
      it('should join the list items into a single list', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(
              p('A{<>}'),
              ul(
                li(p('B')),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected = doc(
          p('A'),
          ol(
            li(p('B')),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    describe('when outdent the first list item with nested list', () => {
      it('should join the list items into a single list', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(
              p('A{<>}'),
              ol(
                li(p('B')),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected = doc(
          p('A'),
          ol(
            li(p('B')),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    describe('when outdent the first list item with deep nested list', () => {
      it('should join the list items into a single list', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(
              p('A{<>}'),
              ol(
                li(
                  p('B'),
                  ol(
                    li(p('B1')),
                  ),
                ),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected = doc(
          p('A'),
          ol(
            li(
              p('B'),
              ol(
                li(p('B1')),
              ),
            ),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    describe('when outdent the first list item with deep mixed nested list', () => {
      it('should join the list items into a single list', () => {
        // prettier-ignore
        const document = doc(
          ol(
            li(
              p('A{<>}'),
              ul(
                li(
                  p('B'),
                  ul(
                    li(p('B1')),
                  ),
                ),
              ),
            ),
            li(p('C')),
          )
        );
        // prettier-ignore
        const expected = doc(
          p('A'),
          ol(
            li(
              p('B'),
              ul(
                li(p('B1')),
              ),
            ),
            li(p('C')),
          ),
        );
        const { editorView } = editor(document);

        outdentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );

        expect(editorView.state.doc).toEqualDocument(expected);
      });
    });

    it('should call outdent analytics', () => {
      const document = doc(ol(li(p('One'), ul(li(p('Two{<>}'))))));
      const { editorView } = editor(document);
      outdentList(INPUT_METHOD.KEYBOARD)(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'outdented',
        actionSubject: 'list',
        actionSubjectId: 'bulletedList',
        eventType: 'track',
        attributes: expect.objectContaining({
          inputMethod: 'keyboard',
        }),
      });
    });
  });
});
