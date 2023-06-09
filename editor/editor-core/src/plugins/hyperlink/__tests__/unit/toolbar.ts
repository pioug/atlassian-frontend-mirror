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
import {
  FloatingToolbarButton,
  FloatingToolbarItem,
} from '../../../../plugins/floating-toolbar/types';
import type { Command } from '@atlaskit/editor-common/types';
import deprecatedAnalyticsPlugin from '../../../../plugins/analytics';
import { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import featureFlagsPlugin from '@atlaskit/editor-plugin-feature-flags';

describe('linking', () => {
  const createEditor = createProsemirrorEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: DocBuilder) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      preset: new Preset<LightEditorPlugin>()
        .add([featureFlagsPlugin, {}])
        .add([analyticsPlugin, { createAnalyticsEvent }])
        .add([deprecatedAnalyticsPlugin, { createAnalyticsEvent }])
        .add(hyperlinkPlugin),
    });
  };

  describe('#getToolbarConfig', () => {
    let featureFlagsMock = {};
    let providerFactory: ProviderFactory;

    beforeEach(() => {
      providerFactory = new ProviderFactory();
      featureFlagsMock = {
        floatingToolbarLinkSettingsButton: undefined,
      };
    });

    afterEach(() => {
      featureFlagsMock = {};
    });

    afterAll(() => {
      featureFlagsMock = {};
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

      const toolbarConfig = getToolbarConfig({}, {}, undefined)(
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

      const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
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
      featureFlagsMock = {
        floatingToolbarLinkSettingsButton: 'true',
      };
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
        editorView.state,
        intl,
        providerFactory,
      );

      const items = (toolbarConfig && toolbarConfig.items) || [];

      const settingsItemIndex = (
        items as FloatingToolbarItem<Command>[]
      ).findIndex((item: any) => item.id === 'editor.link.settings');

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
      featureFlagsMock = {
        floatingToolbarLinkSettingsButton: 'true',
      };
      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
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
      featureFlagsMock = {
        floatingToolbarLinkSettingsButton: 'false',
      };

      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
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
      featureFlagsMock = {
        floatingToolbarLinkSettingsButton: undefined,
      };

      const { editorView } = editor(
        doc(
          p(
            link({ href: 'https://www.atlassian.com' })(
              'www.{<}atlassian{>}.com',
            ),
          ),
        ),
      );

      const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
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

      const toolbarConfig = getToolbarConfig(
        {
          cardOptions: {
            allowEmbeds: true,
          },
          platform: 'web',
        },
        featureFlagsMock,
        undefined,
      )(editorView.state, intl, providerFactory);

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

    it.each([
      [true, 570],
      [false, 360],
    ])(
      'when feature flag `lpLinkPicker` is %p, should provide height of %d to link picker toolbar',
      (lpLinkPicker, height) => {
        featureFlagsMock = {
          lpLinkPicker,
        };

        const { editorView } = editor(
          doc(
            p(
              link({ href: 'https://www.atlassian.com' })(
                'www.{<}atlassian{>}.com',
              ),
            ),
          ),
        );

        const toolbarConfig = getToolbarConfig({}, featureFlagsMock, undefined)(
          editorView.state,
          intl,
          providerFactory,
        )!;
        const items = toolbarConfig.items;

        const editButton = (items as FloatingToolbarButton<Command>[]).find(
          (item) => 'id' in item && item.id === 'editor.link.edit',
        )!;
        editButton.onClick(editorView.state, editorView.dispatch);
        const editToolbar = getToolbarConfig({}, featureFlagsMock, undefined)(
          editorView.state,
          intl,
          providerFactory,
        )!;
        expect(editToolbar?.height).toBe(height);
      },
    );
  });
});
