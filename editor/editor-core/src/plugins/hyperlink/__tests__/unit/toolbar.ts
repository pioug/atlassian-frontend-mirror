import { createIntl } from 'react-intl-next';
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
import * as featureFlags from '../../../../plugins/feature-flags-context';
import {
  FloatingToolbarButton,
  FloatingToolbarItem,
} from '../../../../plugins/floating-toolbar/types';
import { Command } from '../../../../types';
import analyticsPlugin from '../../../../plugins/analytics';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';

describe('linking', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add(hyperlinkPlugin),
    });
  };

  describe('#getToolbarConfig', () => {
    const featureFlagSpy = jest.spyOn(featureFlags, 'getFeatureFlags');
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
      featureFlagSpy.mockReturnValue({
        floatingToolbarLinkSettingsButton: undefined,
      });
    });

    afterEach(() => {
      featureFlagSpy.mockReset();
    });

    afterAll(() => {
      featureFlagSpy.mockRestore();
    });

    const intl = createIntl({
      locale: 'en',
    });

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

      const toolbarConfig = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const linkItem: any = (items as []).find(
        (item: any) => item.className === 'hyperlink-open-link',
      );

      expect(linkItem.disabled).toBeFalsy();
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

      const toolbarConfig = getToolbarConfig()(
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

    it('should show the settings button when feature flag is enabled', () => {
      featureFlagSpy.mockReturnValue({
        floatingToolbarLinkSettingsButton: 'true',
      });
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const settingsItemIndex = (items as FloatingToolbarItem<
        Command
      >[]).findIndex((item: any) => item.id === 'editor.link.settings');

      // Ensure settings button is the last item in toolbar
      expect(items.length - 1).toEqual(settingsItemIndex);

      const settingsItem = (items as FloatingToolbarItem<Command>[])[
        settingsItemIndex
      ] as FloatingToolbarButton<Command>;

      expect(settingsItem.disabled).toBeFalsy();
      expect(settingsItem.title).toEqual('Go to Link Preferences');
      expect(settingsItem.href).toEqual(
        'https://id.atlassian.com/manage-profile/link-preferences',
      );
      expect(settingsItem.target).toEqual('_blank');

      const settingsItemSeparator = (items as FloatingToolbarItem<Command>[])[
        settingsItemIndex - 1
      ];
      // Ensure separator is to the left of settings button
      expect(settingsItemSeparator.type).toEqual('separator');
    });

    it('should fire the correct analytics event when settings button is clicked', () => {
      featureFlagSpy.mockReturnValue({
        floatingToolbarLinkSettingsButton: 'true',
      });
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const settingsItem = (items as FloatingToolbarButton<Command>[]).find(
        (item: any) => item.id === 'editor.link.settings',
      );

      settingsItem?.onClick(editorView.state, editorView.dispatch);
      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'goToSmartLinkSettings',
        attributes: expect.objectContaining({
          inputMethod: 'toolbar',
          display: 'url',
        }),
        eventType: 'ui',
      });
    });

    it('should not show the settings button when feature flag is explicitly disabled', () => {
      featureFlagSpy.mockReturnValue({
        floatingToolbarLinkSettingsButton: 'false',
      });

      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const settingsItem: any = (items as []).find(
        (item: any) => item.id === 'editor.link.settings',
      );

      expect(settingsItem).toBeFalsy();
    });

    it('should not show the settings button when feature flag is undefined', () => {
      featureFlagSpy.mockReturnValue({
        floatingToolbarLinkSettingsButton: undefined,
      });

      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig()(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const settingsItem: any = (items as []).find(
        (item: any) => item.id === 'editor.link.settings',
      );

      expect(settingsItem).toBeFalsy();
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

      const toolbarConfig = getToolbarConfig({
        cardOptions: {
          allowEmbeds: true,
        },
        platform: 'web',
      })(editorView.state, intl, providerFactory);

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
          platform: 'web',
        }),
      );
    });
  });
});
