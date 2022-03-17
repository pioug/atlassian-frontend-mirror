import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { bodiedExtensionData } from '@atlaskit/editor-test-helpers/mock-extension-data';
import {
  doc,
  hr,
  p,
  bodiedExtension,
  panel,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { insertHorizontalRule } from '../../../../plugins/rule/commands';
import { INPUT_METHOD } from '../../../../plugins/analytics';

describe('rule', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn(() => ({ fire() {} } as UIAnalyticsEvent));
    return createEditor({
      doc,
      editorProps: {
        allowExtension: {
          allowBreakout: true,
        },
        allowAnalyticsGASV3: true,
        allowRule: true,
        allowPanel: true,
        allowNewInsertionBehaviour: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('keymap', () => {
    describe('when hits Shift-Ctrl--', () => {
      it('should create rule', () => {
        const { editorView } = editor(doc(p('text{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(doc(p('text'), hr()));
      });

      it('should create rule inside bodied ext', () => {
        const extensionAttrs = bodiedExtensionData[1].attrs;
        const { editorView } = editor(
          doc(bodiedExtension(extensionAttrs)(p('{<>}'), p('text'))),
        );
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(editorView.state.doc).toEqualDocument(
          doc(bodiedExtension(extensionAttrs)(hr(), p('{<>}text'))),
        );
      });

      it('should fire analytics event when create rule', () => {
        const { editorView } = editor(doc(p('{<>}')));
        sendKeyToPm(editorView, 'Shift-Ctrl--');
        expect(createAnalyticsEvent).toBeCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'divider',
          attributes: expect.objectContaining({ inputMethod: 'shortcut' }),
          eventType: 'track',
        });
      });
    });
  });

  describe('insert via toolbar', () => {
    it('should insert rule when selection is empty paragraph', () => {
      const { editorView } = editor(doc(p('{<>}')));
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(doc(hr()));
    });

    it('should split the paragraph and insert rule when selection is in the middle of a paragraph', () => {
      const { editorView } = editor(doc(p('this is a{<>} paragraph')));
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        // prettier-ignore
        doc(
          p('this is a'),
          hr(),
          p(' paragraph')
        ),
      );
    });

    it('should insert rule below when selection is in the middle of a node which does not allow rules', () => {
      const { editorView } = editor(
        // prettier-ignore
        doc(
          panel()(p('this is a {<>}paragraph')),
          p()
        ),
      );
      insertHorizontalRule(INPUT_METHOD.TOOLBAR)(
        editorView.state,
        editorView.dispatch,
      );
      expect(editorView.state.doc).toEqualDocument(
        // prettier-ignore
        doc(
          panel()(
            p('this is a paragraph')
          ),
          hr(),
          p(),
        ),
      );
    });
  });
});
