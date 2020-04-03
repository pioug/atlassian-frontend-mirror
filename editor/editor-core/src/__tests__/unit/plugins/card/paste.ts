import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import { setProvider } from '../../../../plugins/card/pm-plugins/actions';

import { EditorTestCardProvider } from '@atlaskit/editor-test-helpers/card-provider';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import dispatchPasteEvent from '@atlaskit/editor-test-helpers/dispatch-paste-event';
import {
  doc,
  p,
  inlineCard,
} from '@atlaskit/editor-test-helpers/schema-builder';

describe('card', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        UNSAFE_cards: {},
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

    describe('pasting card from Renderer to Editor', () => {
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
                      class="inline-card-icon sc-TOsTZ dDpehj"
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
  });
});
