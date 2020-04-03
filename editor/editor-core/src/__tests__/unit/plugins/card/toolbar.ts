import { ProviderFactory } from '@atlaskit/editor-common';
import { IntlProvider } from 'react-intl';
import createEditorFactory from '@atlaskit/editor-test-helpers/create-editor';
import {
  doc,
  p,
  inlineCard,
  blockCard,
} from '@atlaskit/editor-test-helpers/schema-builder';
import {
  floatingToolbar,
  messages as floatingToolbarMessages,
} from '../../../../plugins/card/toolbar';
import { pluginKey } from '../../../../plugins/card/pm-plugins/main';

import commonMessages, {
  linkToolbarMessages,
  linkMessages,
} from '../../../../messages';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';

import {
  FloatingToolbarButton,
  FloatingToolbarDropdown,
} from '../../../../plugins/floating-toolbar/types';
import { Command } from '../../../../types';
import { getToolbarItems } from '../floating-toolbar/_helpers';
import { DropdownOptionT } from '../../../../plugins/floating-toolbar/ui/types';

describe('card', () => {
  const createEditor = createEditorFactory();
  const providerFactory = new ProviderFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      providerFactory,
      editorProps: {
        UNSAFE_cards: {},
      },
      pluginKey,
    });
  };

  describe('toolbar', () => {
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();

    const visitTitle = intl.formatMessage(linkMessages.openLink);
    const unlinkTitle = intl.formatMessage(linkToolbarMessages.unlink);
    const removeTitle = intl.formatMessage(commonMessages.remove);

    it('has an unlink button for inlineCard', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === unlinkTitle,
      );

      expect(unlinkButton).toBeDefined();
      expect(unlinkButton).toMatchObject({
        icon: UnlinkIcon,
      });
    });

    it('has an remove button for blockCard', () => {
      const { editorView } = editor(
        doc(
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a visit button', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(toolbar).toBeDefined();

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      );

      expect(visitButton).toBeDefined();
      expect(visitButton).toMatchObject({
        icon: OpenIcon,
      });
    });

    it('opens the url in a new window defined on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );

      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('opens the url in a new window via data on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              data: {
                url: 'http://www.atlassian.com/',
              },
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const visitButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('deletes a block card', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const removeButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      removeButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('ab'), p('cd')));
    });

    it('deletes an inline card', () => {
      const { editorView } = editor(
        doc(
          p(
            'ab',
            '{<node>}',
            inlineCard({
              data: {
                title: 'Welcome to Atlassian!',
                url: 'http://www.atlassian.com/',
              },
            })(),
            'cd',
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      const unlinkButton = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'button' && item.title === unlinkTitle,
      ) as FloatingToolbarButton<Command>;

      unlinkButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('abWelcome to Atlassian!cd')),
      );
    });

    it('has no toolbar items when url via url attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it('has no toolbar items when url via data attr is invalid', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'javascript:alert(document.domain)',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({})(
        editorView.state,
        intl,
        providerFactory,
      );
      expect(getToolbarItems(toolbar!, editorView).length).toEqual(0);
    });

    it('it has view switcher when block cards are enabled', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({ allowBlockCards: true })(
        editorView.state,
        intl,
        providerFactory,
      );
      const dropdownTitle = intl.formatMessage(floatingToolbarMessages.inline);

      const dropdown = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'dropdown' && item.title === dropdownTitle,
      );

      expect(toolbar).toBeDefined();
      expect(dropdown).toBeDefined();
      expect(
        (dropdown as FloatingToolbarDropdown<Command>).options,
      ).toHaveLength(2);
    });

    it('it updates the dropdown title for different apperance', () => {
      const { editorView } = editor(
        doc(
          p('ab'),
          '{<node>}',
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
          p('cd'),
        ),
      );

      const toolbar = floatingToolbar({ allowBlockCards: true })(
        editorView.state,
        intl,
        providerFactory,
      );
      const dropdownBlockTitle = intl.formatMessage(
        floatingToolbarMessages.block,
      );

      const dropdown = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'dropdown' && item.title === dropdownBlockTitle,
      );

      expect(dropdown).toBeDefined();
    });

    it('it switches apperance on dropdown option click', () => {
      const { editorView } = editor(
        doc(
          p(
            '{<node>}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })(),
          ),
        ),
      );

      const toolbar = floatingToolbar({ allowBlockCards: true })(
        editorView.state,
        intl,
        providerFactory,
      );
      const dropdownTitle = intl.formatMessage(floatingToolbarMessages.inline);
      const blockCardTitle = intl.formatMessage(floatingToolbarMessages.block);

      const dropdown = getToolbarItems(toolbar!, editorView).find(
        item => item.type === 'dropdown' && item.title === dropdownTitle,
      ) as FloatingToolbarDropdown<Command> | undefined;

      expect(dropdown).toBeDefined();
      const blockCardOption = (dropdown!.options as Array<
        DropdownOptionT<Command>
      >).filter(option => option.title === blockCardTitle)[0];

      blockCardOption.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(
        doc(
          blockCard({
            url: 'http://www.atlassian.com/',
          })(),
        ),
      );
    });
  });
});
