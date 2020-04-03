import { IntlProvider } from 'react-intl';
import {
  a as link,
  doc,
  p,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  createProsemirrorEditorFactory,
  LightEditorPlugin,
  Preset,
} from '@atlaskit/editor-test-helpers/create-prosemirror-editor';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

import { getToolbarConfig } from '../../Toolbar';
import hyperlinkPlugin from '../../';

describe('linking', () => {
  const createEditor = createProsemirrorEditorFactory();

  const editor = (doc: any) => {
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
      expect(linkItem.href).toEqual(null);
    });
  });
});
