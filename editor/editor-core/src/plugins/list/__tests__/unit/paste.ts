import {
  Preset,
  LightEditorPlugin,
  createProsemirrorEditorFactory,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  p,
  DocBuilder,
  ol,
  li,
  hardBreak,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { EditorView } from 'prosemirror-view';
import pastePlugin from '../../../paste';
import hyperlinkPlugin from '../../../hyperlink';
import listPlugin from '../..';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';
import blockTypePlugin from '../../../block-type';
import basePlugin from '../../../base';
import { microsoftWordDesktopPasteOutput } from './__fixtures__/paste-word-desktop';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const pasteAndCompare = (
  { editorView }: { editorView: EditorView },
  clipboard: string,
  expected: any,
) => {
  dispatchPasteEvent(editorView, {
    html: clipboard,
  });

  expect(editorView.state.doc).toEqualDocument(expected);
};

describe('paste of lists with restartNumberedLists enabled', () => {
  const createEditor = createProsemirrorEditorFactory();
  const editor = (doc: DocBuilder) =>
    createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, { restartNumberedLists: true }])
        .add([analyticsPlugin, {}])
        .add([pastePlugin, {}])
        .add(hyperlinkPlugin)
        .add([listPlugin, { restartNumberedLists: true }])
        .add(blockTypePlugin)
        .add(basePlugin),
    });

  const emptyDoc = doc(p('{<>}'));
  describe('with start/order number other than 1', () => {
    it('should paste with correct order number from basic HTML', () => {
      const clipboard = `<ol start="6"><li><p>One</p></li><li><p>Two</p></li><li><p>Three</p></li></ol>`;
      const expected = doc(
        ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('should paste with correct order number from Editor', () => {
      const clipboard = `<meta charset='utf-8'><ol start="6" class="ak-ol" data-pm-slice="3 3 []"><li><p>One</p></li><li><p>Two</p></li><li><p>Three</p></li></ol>`;
      const expected = doc(
        ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('should paste with correct order number from Renderer', () => {
      const clipboard = `<meta charset='utf-8'><ol class="ak-ol" data-indent-level="1" start="6" style="margin: 0px; padding: 0px 0px 0px 24px; box-sizing: border-box; list-style-type: decimal; display: flow-root; color: rgb(23, 43, 77); font-family: -apple-system, &quot;system-ui&quot;, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><li><p data-renderer-start-pos="3" style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em;">One</p></li><li style="margin-top: 4px;"><p data-renderer-start-pos="10" style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em;">Two</p></li><li style="margin-top: 4px;"><p data-renderer-start-pos="17" style="margin: 0px; padding: 0px; font-size: 1em; line-height: 1.714; font-weight: normal; letter-spacing: -0.005em;">Three</p></li></ol>`;
      const expected = doc(
        ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('should paste with correct order number from Google Docs', () => {
      const clipboard = `<meta charset='utf-8'><meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-2403c50a-7fff-1beb-546e-cfb011af3058"><ol style="margin-top:0;margin-bottom:0;padding-inline-start:48px;" start="6"><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">One</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Two</span></p></li><li dir="ltr" style="list-style-type:decimal;font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;" aria-level="1"><p dir="ltr" style="line-height:1.38;margin-top:0pt;margin-bottom:0pt;" role="presentation"><span style="font-size:11pt;font-family:Arial;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;">Three</span></p></li></ol></b>`;
      const expected = doc(
        ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('pastes without correct order number from Notion', () => {
      const clipboard = `<meta charset='utf-8'><ol>
    <li>One</li>
    <li>Two</li>
    <li>Three</li>
    </ol>`;
      const expected = doc(ol()(li(p('One')), li(p('Two')), li(p('Three'))));
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('should paste without correct order number from Microsoft Word Online', () => {
      const clipboard = `<meta charset='utf-8'><div class="ListContainerWrapper SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW11351243 BCX0" role="list" start="6" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: decimal;"><li data-leveltext="%1." data-font="Calibri" data-listid="2" data-list-defn-props="{&quot;335551671&quot;:6,&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="6" role="listitem" data-aria-level="1" class="OutlineElement Ltr SCXW11351243 BCX0" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 11pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW11351243 BCX0" xml:lang="EN-US" lang="EN-US" paraid="1480597591" paraeid="{6282bc4e-b4d0-47cd-a5d1-60b33b900603}{80}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">One</span></span><span class="EOP SCXW11351243 BCX0" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW11351243 BCX0" role="list" start="7" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: decimal;"><li data-leveltext="%1." data-font="Calibri" data-listid="2" data-list-defn-props="{&quot;335551671&quot;:6,&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="7" role="listitem" data-aria-level="1" class="OutlineElement Ltr SCXW11351243 BCX0" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 11pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW11351243 BCX0" xml:lang="EN-US" lang="EN-US" paraid="1655382874" paraeid="{6282bc4e-b4d0-47cd-a5d1-60b33b900603}{124}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Two</span></span><span class="EOP SCXW11351243 BCX0" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ol></div><div class="ListContainerWrapper SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; position: relative; color: rgb(0, 0, 0); font-family: Calibri, Calibri_MSFontService, sans-serif; font-size: 14.6667px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: left; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(255, 255, 255); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><ol class="NumberListStyle1 SCXW11351243 BCX0" role="list" start="8" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; list-style-type: decimal;"><li data-leveltext="%1." data-font="Calibri" data-listid="2" data-list-defn-props="{&quot;335551671&quot;:6,&quot;335552541&quot;:0,&quot;335559683&quot;:0,&quot;335559684&quot;:-1,&quot;335559685&quot;:720,&quot;335559991&quot;:360,&quot;469769242&quot;:[65533,0,46],&quot;469777803&quot;:&quot;left&quot;,&quot;469777804&quot;:&quot;%1.&quot;,&quot;469777815&quot;:&quot;hybridMultilevel&quot;}" aria-setsize="-1" data-aria-posinset="8" role="listitem" data-aria-level="1" class="OutlineElement Ltr SCXW11351243 BCX0" style="margin: 0px 0px 0px 24px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow: visible; cursor: text; clear: both; position: relative; direction: ltr; display: block; font-size: 11pt; font-family: Calibri, Calibri_MSFontService, sans-serif; vertical-align: baseline;"><p class="Paragraph SCXW11351243 BCX0" xml:lang="EN-US" lang="EN-US" paraid="660218659" paraeid="{6282bc4e-b4d0-47cd-a5d1-60b33b900603}{152}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; overflow-wrap: break-word; white-space: pre-wrap; font-weight: normal; font-style: normal; vertical-align: baseline; font-kerning: none; background-color: transparent; color: windowtext; text-align: left; text-indent: 0px;"><span data-contrast="auto" xml:lang="EN-US" lang="EN-US" class="TextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-variant-ligatures: none !important; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"><span class="NormalTextRun SCXW11351243 BCX0" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent;">Three</span></span><span class="EOP SCXW11351243 BCX0" data-ccp-props="{&quot;201341983&quot;:0,&quot;335559739&quot;:160,&quot;335559740&quot;:259}" style="margin: 0px; padding: 0px; user-select: text; -webkit-user-drag: none; -webkit-tap-highlight-color: transparent; font-size: 11pt; line-height: 18.3458px; font-family: Calibri, Calibri_EmbeddedFont, Calibri_MSFontService, sans-serif;"> </span></p></li></ol></div>`;
      const expected = doc(
        ol({ order: 6 })(li(p('One'))),
        ol({ order: 7 })(li(p('Two'))),
        ol({ order: 8 })(li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('pastes without correct order number from Microsoft Word Desktop', () => {
      const clipboard = microsoftWordDesktopPasteOutput;
      const expected = doc(
        ol()(li(p('One'))),
        ol()(li(p('Two'))),
        ol()(li(p('Three'))),
      );
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('pastes without correct order number from Apple Pages', () => {
      const clipboard = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="Content-Style-Type" content="text/css">
    <title></title>
    <meta name="Generator" content="Cocoa HTML Writer">
    <meta name="CocoaVersion" content="2113.6">
    <style type="text/css">
    li.li1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 11.0px 'Helvetica Neue'; color: #000000}
    ol.ol1 {list-style-type: decimal}
    </style>
    </head>
    <body>
    <ol class="ol1">
    <li class="li1">One</li>
    <li class="li1">Two</li>
    <li class="li1">Three</li>
    </ol>
    </body>
    </html>
    `;
      const expected = doc(ol()(li(p('One')), li(p('Two')), li(p('Three'))));
      pasteAndCompare(editor(emptyDoc), clipboard, expected);
    });

    it('should paste with correct order number when pasting markdown with custom start number', () => {
      const { editorView } = editor(emptyDoc);
      const clipboard = `6. One\n7. Two\n8. Three`;
      const expected = doc(
        ol({ order: 6 })(li(p('One')), li(p('Two')), li(p('Three'))),
      );
      dispatchPasteEvent(editorView, { plain: clipboard });
      expect(editorView.state.doc).toEqualDocument(expected);
    });

    it('should paste plain text instead of list when pasting markdown with negative start number', () => {
      const { editorView } = editor(emptyDoc);
      const clipboard = `-6. One\n-7. Two\n-8. Three`;
      const expected = doc(
        p('-6. One', hardBreak(), '-7. Two', hardBreak(), '-8. Three'),
      );

      dispatchPasteEvent(editorView, { plain: clipboard });
      expect(editorView.state.doc).toEqualDocument(expected);
    });
  });
});
