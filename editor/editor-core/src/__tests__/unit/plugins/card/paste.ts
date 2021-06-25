import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import { setProvider } from '../../../../plugins/card/pm-plugins/actions';

import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  DocBuilder,
  p,
  inlineCard,
  blockquote,
  blockCard,
  embedCard,
} from '@atlaskit/editor-test-helpers/doc-builder';

describe('card', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      editorProps: {
        smartLinks: {
          allowEmbeds: true,
        },
      },
      pluginKey,
    });
  };

  describe('paste', () => {
    describe('pasting plain text url', () => {
      it('should queue a card with spaces', () => {
        const text =
          'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0';

        const { editorView } = editor(doc(p('{<>}')));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { plain: text });

        expect(pluginKey.getState(editorView.state)).toEqual({
          cards: [],
          requests: [
            {
              url:
                'https://www.atlassian.com/s/7xr7xdqto7trhvr/Media%20picker.sketch?dl=0',
              pos: 1,
              appearance: 'inline',
              compareLinkText: true,
              source: 'clipboard',
            },
          ],
          provider,
          showLinkingToolbar: false,
        });
      });
    });

    describe('pasting inline link from Renderer to Editor', () => {
      it('does not parse Smart Icons to be MediaSingles', () => {
        const html = `
        <meta charset="utf-8" />
        <span>Convert this into Smart link: </span>
        <span
          data-inline-card="true"
          data-card-url="https://docs.google.com/spreadsheets/d/168cPaeXw/edit"
          ><span>
            <a
              class="sc-cHGsZl dxBXRc"
              href=""
              tabindex="0"
              role="button"
              data-testid="undefined-unauthorized"
            >
              <span class="sc-eqIVtm jFLCww"
                ><span class="sc-fAjcbJ bLQUDw"
                  ><span class="sc-gisBJw cyxrPT">
                    <span
                      class="sc-kjoXOD dIVSoJ"
                    ></span>
                    <img
                      class="smart-link-icon sc-TOsTZ dDpehj"
                      src="https://avatar-management--avatars.us-west-2.staging.public.atl-paas.net/default-avatar.png"
                    /> </span
                  >https:/</span
                >/docs.google.com/spreadsheets/d/168cPaeXw/edit</span
              >
              ‑
              <button type="button" class="css-1xjowgn">
                <span class="css-j8fq0c"
                  ><span class="css-eaycls"
                    ><span>Connect your account to preview links</span></span
                  ></span
                >
              </button></a
            ></span
          ></span
        ><span></span>
        `;

        const { editorView } = editor(doc(p('{<>}')));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'Convert this into Smart link: ',
              inlineCard({
                url: 'https://docs.google.com/spreadsheets/d/168cPaeXw/edit',
              })(),
            ),
          ),
        );
      });
    });

    describe('pasting block link from Renderer to Editor', () => {
      it('does not parse Smart Icons to be MediaSingles', () => {
        const html = `
          <div
            class="blockCardView-content-wrap"
            data-block-card="true"
            data-card-url="https://www.dropbox.com/s/maz65d0qxp87qli/Video%20MP4%20%28440x868%29.mp4?dl=0"
          >
            <div>
              <div class="css-1vk34fx-ExpandedFrame">
                <div class="css-11gdpsf-Content">
                  <div><div class="css-1jpm07v-ResolvedView"></div></div>
                </div>
              </div>
            </div>
          </div>
          <div class="css-emgeve-Provider">
            <img
              class="smart-link-icon css-1kn7193-Provider"
              src="https://www.dropbox.com/static/30168/images/favicon.ico"
            />
          </div>
        `;

        const { editorView } = editor(doc(p('{<>}')));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            blockCard({
              url:
                'https://www.dropbox.com/s/maz65d0qxp87qli/Video%20MP4%20%28440x868%29.mp4?dl=0',
            })(),
          ),
        );
      });
    });

    describe('pasting embed link from Renderer to Editor', () => {
      it('does not parse Smart Icons to be MediaSingles', () => {
        const html = `
        <meta charset="utf-8" />
        <div
          data-embed-card="true"
          data-layout="center"
          data-width="50"
          data-card-url="https://drive.google.com/file/d/1Y5S4AYkoLjseAiSCdsjgYd6LjWOS1qtA/view?usp=sharing"
        >
          <div>
            <div class="media-card-frame sc-jQMNup dcXBMK" data-testid="resolved-view">
              <div
                class="embed-header sc-TuwoP kxyEBi">
                <div
                  class="sc-fQkuQJ gtHBSu"
                >
                  <img
                    class="sc-fCPvlr hnrZq"
                    src="https://developers.google.com/drive/images/drive_icon.png"
                    alt=""
                    size="16"
                  />
                </div>
                <div class="sc-epGmkI jHFjbJ">
                  Google Drive
                </div>
              </div>
              <div class="sc-dphlzf djeAul">
                <iframe
                  src="https://drive.google.com/file/d/1Y5S4AYkoLjseAiSCdsjgYd6LjWOS1qtA/view?usp=sharing"
                  data-testid="resolved-view-frame"
                  allowfullscreen=""
                  scrolling="yes"
                  allow="autoplay; encrypted-media"
                  class="css-v4oqcm-Frame"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        `;

        const { editorView } = editor(doc(p('{<>}')));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            embedCard({
              url:
                'https://drive.google.com/file/d/1Y5S4AYkoLjseAiSCdsjgYd6LjWOS1qtA/view?usp=sharing',
              layout: 'center',
              width: 50,
            })(),
          ),
        );
      });
    });

    describe('pasting a block link where is not supported ', () => {
      it('converts it to inline card', () => {
        const html = `<meta charset='utf-8'><a data-block-card="" href="https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing" data-card-data="" data-pm-slice="0 0 []"></a>`;
        const { editorView } = editor(
          doc(p('Paragraph'), blockquote(p('{<>}'))),
        );
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { html });
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('Paragraph'),
            blockquote(
              p(
                inlineCard({
                  url:
                    'https://docs.google.com/spreadsheets/d/168c/edit?usp=sharing',
                })(),
              ),
            ),
          ),
        );
      });
    });

    describe('pasting inline link from Editor to Editor', () => {
      it('resolves a copied smart link back into a smart link', () => {
        const html = `
        <meta charset='utf-8'>
        <a data-inline-card="" href="https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/729155214/ADF+Change+23%3A+Image+Captions" data-card-data="" data-pm-slice="0 0 []">https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/729155214/ADF+Change+23%3A+Image+Captions</a>`;
        const { editorView } = editor(doc(p('{<>}')));
        const { state, dispatch } = editorView;

        const provider = new EditorTestCardProvider();
        dispatch(setProvider(provider)(state.tr));

        dispatchPasteEvent(editorView, { html });

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              inlineCard({
                url:
                  'https://product-fabric.atlassian.net/wiki/spaces/ADF/pages/729155214/ADF+Change+23%3A+Image+Captions',
              })(),
            ),
          ),
        );
      });
    });
  });
});
