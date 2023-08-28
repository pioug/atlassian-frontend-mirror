import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { editorCommandToPMCommand } from '@atlaskit/editor-common/preset';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import {
  createProsemirrorEditorFactory,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import type { LightEditorPlugin } from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { doc, li, ol, p, ul } from '@atlaskit/editor-test-helpers/doc-builder';
import type { DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';

import { indentList } from '../../../commands';
import { listPlugin } from '../../../index';

describe('lists plugin -> commands -> outdentList', () => {
  const createProseMirrorEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;
  const editorAnalyticsAPIFake: EditorAnalyticsAPI = {
    attachAnalyticsEvent: jest.fn().mockReturnValue(() => jest.fn()),
  };

  const editor = (doc: DocBuilder) => {
    const preset = new Preset<LightEditorPlugin>()
      .add([featureFlagsPlugin, {}])
      .add([analyticsPlugin, { createAnalyticsEvent }])
      .add(listPlugin);

    return createProseMirrorEditor({
      doc,
      preset,
    });
  };

  describe('#indentList', () => {
    describe('when the cursor is at the last maximum nested list item allowed', () => {
      // prettier-ignore
      const document = doc(
        ol()(
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
        const { editorAPI } = editor(document);
        const result = editorAPI.core.actions.execute(
          editorAPI.list.commands.indentList(INPUT_METHOD.KEYBOARD),
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const {
          editorView: { state, dispatch },
        } = editor(document);
        editorCommandToPMCommand(
          indentList(editorAnalyticsAPIFake)(INPUT_METHOD.KEYBOARD),
        )(state, dispatch);
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).not.toHaveBeenCalled();
      });
    });

    describe('when the cursor is at the first list item of a nested item', () => {
      // prettier-ignore
      const document = doc(
        ol()(
          li(
            p('One'),
            ul(
              li(p('Two{<>}')),
            ),
          ),
        ),
      );

      it('should return true', () => {
        const { editorAPI } = editor(document);
        const result = editorAPI.core.actions.execute(
          editorAPI.list.commands.indentList(INPUT_METHOD.KEYBOARD),
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const {
          editorView: { state, dispatch },
        } = editor(document);
        editorCommandToPMCommand(
          indentList(editorAnalyticsAPIFake)(INPUT_METHOD.KEYBOARD),
        )(state, dispatch);
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).not.toHaveBeenCalled();
      });
    });

    describe('when the cursor is at the first list item', () => {
      // prettier-ignore
      const document = doc(
        ol()(
          li(
            p('One{<>}'),
            ul(
              li(p('Two')),
            ),
          ),
        ),
      );

      it('should return true', () => {
        const { editorAPI } = editor(document);
        const result = editorAPI.core.actions.execute(
          editorAPI.list.commands.indentList(INPUT_METHOD.KEYBOARD),
        );
        expect(result).toBe(true);
      });

      it('should not call analytics', () => {
        const {
          editorView: { state, dispatch },
        } = editor(document);
        editorCommandToPMCommand(
          indentList(editorAnalyticsAPIFake)(INPUT_METHOD.KEYBOARD),
        )(state, dispatch);
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).not.toHaveBeenCalled();
      });
    });

    describe('when indented', () => {
      // prettier-ignore
      const document = doc(
        ol()(
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
        const {
          editorView: { state, dispatch },
        } = editor(document);
        editorCommandToPMCommand(
          indentList(editorAnalyticsAPIFake)(INPUT_METHOD.KEYBOARD),
        )(state, dispatch);
        expect(
          editorAnalyticsAPIFake.attachAnalyticsEvent,
        ).toHaveBeenCalledWith({
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
