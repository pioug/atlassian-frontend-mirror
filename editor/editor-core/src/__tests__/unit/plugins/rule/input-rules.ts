import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  hr,
  p,
  code_block,
  hardBreak,
  blockquote,
} from '@atlaskit/editor-test-helpers/schema-builder';
import { insertText } from '@atlaskit/editor-test-helpers/transactions';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('inputrules', () => {
  const createEditor = createEditorFactory();

  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any, trackEvent = () => {}) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: {
        analyticsHandler: trackEvent,
        allowAnalyticsGASV3: true,
        allowRule: true,
        allowNewInsertionBehaviour: true,
      },
      createAnalyticsEvent,
    });
  };

  describe('rule', () => {
    it('should not convert "***" in the middle of a line to a horizontal rule', () => {
      const { editorView, sel } = editor(doc(p('test{<>}')));

      insertText(editorView, 'text***', sel);

      expect(editorView.state.doc).not.toEqualDocument(
        doc(p('testtext'), hr(), p()),
      );
    });

    it('should convert "---" at the start of a line to horizontal rule', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(doc(hr()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should not convert "---" inside a block to horizontal rule', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(
        doc(blockquote(p('text{<>}'))),
        trackEvent,
      );

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(blockquote(p('text---'))),
      );
      expect(trackEvent).not.toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should convert "---" in the start of a line after shift+enter to a horizontal rule', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), '{<>}test')),
        trackEvent,
      );

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('test'), hr(), p('test')),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should not convert "---" in the middle of a line to a horizontal rule', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'text---', sel);

      expect(editorView.state.doc).not.toEqualDocument(
        doc(p('text'), hr(), p()),
      );
    });

    it('should not convert "---" inside a code_block', () => {
      const { editorView, sel } = editor(doc(code_block()('{<>}')));

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(doc(code_block()('---')));
    });

    it('should convert "***" at the start of a line to horizontal rule', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(doc(p('{<>}')), trackEvent);

      insertText(editorView, '***', sel);

      expect(editorView.state.doc).toEqualDocument(doc(hr()));
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should not convert "***" in the middle of a line to a horizontal rule', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));

      insertText(editorView, 'text***', sel);

      expect(editorView.state.doc).not.toEqualDocument(
        doc(p('text'), hr(), p()),
      );
    });

    it('should convert "***" in the start of a line after shift+enter to a horizontal rule', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(
        doc(p('test', hardBreak(), '{<>}test')),
        trackEvent,
      );

      insertText(editorView, '***', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('test'), hr(), p('test')),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should convert "---" but keep paragraph below', () => {
      const trackEvent = jest.fn();
      const { editorView, sel } = editor(
        doc(p('test'), p('{<>}'), p('test')),
        trackEvent,
      );

      insertText(editorView, '---', sel);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('test'), hr(), p('test')),
      );
      expect(trackEvent).toHaveBeenCalledWith(
        'atlassian.editor.format.horizontalrule.autoformatting',
      );
    });

    it('should fire analytics event when convert "---" to rule', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '---', sel);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'divider',
        attributes: expect.objectContaining({ inputMethod: 'autoformatting' }),
        eventType: 'track',
      });
    });

    it('should fire analytics event when convert "***" to rule', () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '***', sel);
      expect(createAnalyticsEvent).toBeCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'divider',
        attributes: expect.objectContaining({ inputMethod: 'autoformatting' }),
        eventType: 'track',
      });
    });
  });
});
