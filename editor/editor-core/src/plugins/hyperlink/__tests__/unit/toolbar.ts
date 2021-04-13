import { IntlProvider } from 'react-intl';
import {
  a as link,
  doc,
  p,
  DocBuilder,
} from '@atlaskit/editor-test-helpers/doc-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { getToolbarConfig } from '../../Toolbar';
import hyperlinkPlugin from '../../';
import { HyperlinkToolbarAppearance } from '../../HyperlinkToolbarAppearance';

describe('linking', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: DocBuilder) => {
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>().add(hyperlinkPlugin),
    });
  };

  describe('#getToolbarConfig', () => {
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
    });

    const intlProvider = new IntlProvider({
      locale: 'en',
    });
    const intl = intlProvider.getChildContext().intl;

    it('enable the link button when link is safe', () => {
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const linkItem: any = (items as []).find(
        (item: any) => item.className === 'hyperlink-open-link',
      );

      expect(linkItem.disable).toBeFalsy();
      expect(linkItem.title).toEqual('Open link in a new tab');
      expect(linkItem.href).toEqual('https://www.atlassian.com');
    });

    it('disable the link button when link is unsafe', () => {
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'javascript://alert("hack")' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const linkItem: any = (items as []).find(
        (item: any) => item.className === 'hyperlink-open-link',
      );

      expect(linkItem.disabled).toBeTruthy();
      expect(linkItem.title).toEqual('Unable to open this link');
      expect(linkItem.href).toBeUndefined();
    });

    it('should render HyperlinkToolbarAppearance with right props', () => {
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig(
        editorView.state,
        intl,
        providerFactory,
        {
          allowEmbeds: true,
        },
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];
      const toolbarAppearanceItem: any = (items as []).find(
        (item: any) => item.type === 'custom',
      );
      const hyperlinkToolbarAppearanceInstance = toolbarAppearanceItem.render();

      expect(hyperlinkToolbarAppearanceInstance.type).toEqual(
        HyperlinkToolbarAppearance,
      );
      expect(hyperlinkToolbarAppearanceInstance.props).toEqual(
        expect.objectContaining({
          url: 'https://www.atlassian.com',
          cardOptions: {
            allowEmbeds: true,
          },
        }),
      );
    });
  });
});
