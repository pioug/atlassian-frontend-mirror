import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  code_block,
  media,
  mediaSingle,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';

describe('inputrules', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorProps: {
        legacyImageUploadProvider: Promise.resolve(() => {}),
        media: {
          allowMediaSingle: true,
        },
        analyticsHandler: trackEvent,
      },
    });

  describe('image rule', () => {
    it('should convert `![text](url)` to image', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(), mediaSingle()(media({ type: 'external', url: 'url' })()), p()),
      );

      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.image.autoformatting',
      );
    });

    it('should convert `![](url)` to image', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '![](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(), mediaSingle()(media({ type: 'external', url: 'url' })()), p()),
      );

      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.image.autoformatting',
      );
    });

    it('should not convert `![text](url)` to image inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '![text](url)', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(code_block()('![text](url)')),
      );
    });
  });
});
