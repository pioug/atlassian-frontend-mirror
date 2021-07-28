import appleTextHTML from './__third-party__/apple-pages/text/html';
import appleTextPlain from './__third-party__/apple-pages/text/plain';
import confluenceTextHTML from './__third-party__/atlassian-confluence/text/html';
import confluenceTextPlain from './__third-party__/atlassian-confluence/text/plain';
import dropboxTextHTML from './__third-party__/dropbox-paper/text/html';
import dropboxTextPlain from './__third-party__/dropbox-paper/text/plain';
import googleTextHTML from './__third-party__/google-docs/text/html';
import googleTextPlain from './__third-party__/google-docs/text/plain';
import msWordTextHTML from './__third-party__/microsoft-word/text/html';
import msWordTextPlain from './__third-party__/microsoft-word/text/plain';
import reactSyntaxHighlighterHTML from './__third-party__/react-syntax-highlighter/text/html';
import vsCodeMultiLine from './__third-party__/vs-code/multi-line/html';
import vsCodeSingleLine from './__third-party__/vs-code/single-line/html';

import { toJSON } from '../../../../utils';
import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import { doc, p, DocBuilder } from '@atlaskit/editor-test-helpers/doc-builder';
import { smallImage, dataURItoBlob } from '@atlaskit/media-test-helpers';
import pastePlugin from '../../index';
import textColorPlugin from '../../../text-color';
import tablesPlugin from '../../../table';
import blockTypePlugin from '../../../block-type';
import hyperlinkPlugin from '../../../hyperlink';
import { textFormattingPlugin } from '../../../index';
import listPlugin from '../../../list';
import codeBlockPlugin from '../../../code-block';

describe('paste plugin: third-party', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([pastePlugin, {}])
        .add(textColorPlugin)
        .add(blockTypePlugin)
        .add(hyperlinkPlugin)
        .add(textFormattingPlugin)
        .add(listPlugin)
        .add(codeBlockPlugin)
        .add([
          tablesPlugin,
          {
            tableOptions: { advanced: true },
            breakoutEnabled: false,
            allowContextualMenu: true,
            dynamicSizingEnabled: true,
            fullWidthEnabled: false,
            wasFullWidthEnabled: false,
          },
        ]),
    });
  it('should handle pasting content from Apple Pages', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: appleTextHTML,
      plain: appleTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Confluence', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: confluenceTextHTML,
      plain: confluenceTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Dropbox Paper', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: dropboxTextHTML,
      plain: dropboxTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should handle pasting content from Google Docs', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: googleTextHTML,
      plain: googleTextPlain,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  describe('`Microsoft Word`: ', () => {
    const blob = dataURItoBlob(smallImage);
    const image = new File([blob], 'image.png', { type: 'image/png' });
    const eventPayload = {
      html: msWordTextHTML,
      plain: msWordTextPlain,
      files: [image],
      types: ['Files', 'text/plain', 'text/html'],
    };

    it('should handle pasting content', () => {
      const { editorView } = editor(doc(p('')));

      dispatchPasteEvent(editorView, eventPayload);

      expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
    });

    it('should ignore image on clipboard', () => {
      const { editorView } = editor(doc(p('')));

      const event = dispatchPasteEvent(editorView, eventPayload) as CustomEvent;

      expect(event.cancelBubble).toBe(true);
    });
  });

  it('should handle pasting content using react-syntax-highlighter', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: reactSyntaxHighlighterHTML,
    });
    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should convert multiple lines to a code-block when pasting content from Visual Studio Code', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: vsCodeMultiLine,
    });

    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });

  it('should convert single line to a code mark when pasting content from Visual Studio Code', () => {
    const { editorView } = editor(doc(p('')));
    dispatchPasteEvent(editorView, {
      html: vsCodeSingleLine,
    });

    expect(toJSON(editorView.state.doc)).toMatchDocSnapshot();
  });
});
