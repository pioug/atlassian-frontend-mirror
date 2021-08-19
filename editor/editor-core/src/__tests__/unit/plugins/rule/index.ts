import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { bodiedExtensionData } from '@atlaskit/editor-test-helpers/mock-extension-data';
import {
  doc,
  hr,
  p,
  bodiedExtension,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import sendKeyToPm from '@atlaskit/editor-test-helpers/send-key-to-pm';
import {
  CreateUIAnalyticsEvent,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

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
});
