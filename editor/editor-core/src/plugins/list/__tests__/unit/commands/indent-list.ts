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
import { indentList } from '../../../commands/indent-list';
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

  describe('#indentList', () => {
    describe('when the cursor is at the last maximum nested list item allowed', () => {
      // prettier-ignore
      const document = doc(
        ol(
          li(
            p('One'),
            ul(
              li(
                p(''),
                ul(
                  li(
                    p(''),
                    ul(
                      li(
                        p(''),
                        ul(
                          li(
                            p(''),
                            ul(
                              li(
                                p(''),
                                ul(
                                  li(p('Lol{<>}')),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      );

      it('should return true', () => {
        const { editorView } = editor(document);
        const result = indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const { editorView } = editor(document);
        indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });

    describe('when the cursor is at the first list item of a nested item', () => {
      // prettier-ignore
      const document = doc(
        ol(
          li(
            p('One'),
            ul(
              li(p('Two{<>}')),
            ),
          ),
        ),
      );

      it('should return true', () => {
        const { editorView } = editor(document);
        const result = indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const { editorView } = editor(document);
        indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });

    describe('when the cursor is at the first list item', () => {
      // prettier-ignore
      const document = doc(
        ol(
          li(
            p('One{<>}'),
            ul(
              li(p('Two')),
            ),
          ),
        ),
      );

      it('should return true', () => {
        const { editorView } = editor(document);
        const result = indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const { editorView } = editor(document);
        indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).not.toHaveBeenCalled();
      });
    });

    describe('when indented', () => {
      // prettier-ignore
      const document = doc(
        ol(
          li(
            p('One'),
            ul(
              li(p('Two')),
              li(p('Three{<>}')),
            ),
          ),
        ),
      );

      it('should call indent analytics', () => {
        const { editorView } = editor(document);
        indentList(INPUT_METHOD.KEYBOARD)(
          editorView.state,
          editorView.dispatch,
        );
        expect(createAnalyticsEvent).toHaveBeenCalledWith({
          action: 'indented',
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
});
