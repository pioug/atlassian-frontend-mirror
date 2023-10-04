import React from 'react';

import type { IntlShape } from 'react-intl-next';

import { isSafeUrl } from '@atlaskit/adf-schema';
import type {
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  buildOpenedSettingsPayload,
  buildVisitedLinkPayload,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  buildLayoutButtons,
  commandWithMetadata,
} from '@atlaskit/editor-common/card';
import type { CardOptions } from '@atlaskit/editor-common/card';
import commonMessages, {
  linkMessages,
  linkToolbarMessages,
  cardMessages as messages,
} from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  FLOATING_TOOLBAR_LINKPICKER_CLASSNAME,
  richMediaClassName,
} from '@atlaskit/editor-common/styles';
import type {
  Command,
  ExtractInjectionAPI,
  FeatureFlags,
  FloatingToolbarHandler,
  FloatingToolbarItem,
  LinkPickerOptions,
  PluginDependenciesAPI,
} from '@atlaskit/editor-common/types';
import { SmallerEditIcon } from '@atlaskit/editor-common/ui';
import { canRenderDatasource } from '@atlaskit/editor-common/utils';
import type { HoverDecorationHandler } from '@atlaskit/editor-plugin-decorations';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';
import type { Node, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import {
  findDomRefAtPos,
  removeSelectedNode,
} from '@atlaskit/editor-prosemirror/utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import CogIcon from '@atlaskit/icon/glyph/editor/settings';
import UnlinkIcon from '@atlaskit/icon/glyph/editor/unlink';
import OpenIcon from '@atlaskit/icon/glyph/shortcut';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type { CardPlatform } from '@atlaskit/smart-card';

import { changeSelectedCardToText } from './pm-plugins/doc';
import { pluginKey } from './pm-plugins/main';
import type { CardPluginState } from './types';
import {
  editDatasource,
  EditDatasourceButton,
} from './ui/EditDatasourceButton';
import {
  buildEditLinkToolbar,
  editLink,
  editLinkToolbarConfig,
} from './ui/EditLinkToolbar';
import { LinkToolbarAppearance } from './ui/LinkToolbarAppearance';
import { ToolbarViewedEvent } from './ui/ToolbarViewedEvent';
import {
  appearanceForNodeType,
  displayInfoForCard,
  findCardInfo,
  titleUrlPairFromNode,
} from './utils';

import type { cardPlugin } from './index';

export const removeCard = (
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command =>
  commandWithMetadata(
    (state, dispatch) => {
      if (!(state.selection instanceof NodeSelection)) {
        return false;
      }

      const type = state.selection.node.type.name;
      const payload: AnalyticsEventPayload = {
        action: ACTION.DELETED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        actionSubjectId: type as
          | ACTION_SUBJECT_ID.CARD_INLINE
          | ACTION_SUBJECT_ID.CARD_BLOCK,
        attributes: {
          inputMethod: INPUT_METHOD.TOOLBAR,
          displayMode: type as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK,
        },
        eventType: EVENT_TYPE.TRACK,
      };
      if (dispatch) {
        const { tr } = state;
        removeSelectedNode(tr);
        editorAnalyticsApi?.attachAnalyticsEvent(payload)(tr);
        dispatch(tr);
      }
      return true;
    },
    { action: ACTION.DELETED },
  );

export const visitCardLink =
  (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    if (!(state.selection instanceof NodeSelection)) {
      return false;
    }

    const { type } = state.selection.node;
    const { url } = titleUrlPairFromNode(state.selection.node);

    // All card links should open in the same tab per https://product-fabric.atlassian.net/browse/MS-1583.
    // We are in edit mode here, open the smart card URL in a new window.
    window.open(url);

    if (dispatch) {
      const { tr } = state;
      editorAnalyticsApi?.attachAnalyticsEvent(
        buildVisitedLinkPayload(
          type.name as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK
            | ACTION_SUBJECT_ID.EMBEDS,
        ),
      )(tr);

      dispatch(tr);
    }
    return true;
  };

export const openLinkSettings =
  (editorAnalyticsApi: EditorAnalyticsAPI | undefined): Command =>
  (state, dispatch) => {
    if (!(state.selection instanceof NodeSelection)) {
      return false;
    }
    window.open('https://id.atlassian.com/manage-profile/link-preferences');
    if (dispatch) {
      const {
        tr,
        selection: {
          node: { type },
        },
      } = state;

      editorAnalyticsApi?.attachAnalyticsEvent(
        buildOpenedSettingsPayload(
          type.name as
            | ACTION_SUBJECT_ID.CARD_INLINE
            | ACTION_SUBJECT_ID.CARD_BLOCK
            | ACTION_SUBJECT_ID.EMBEDS,
        ),
      )(tr);
      dispatch(tr);
    }
    return true;
  };

export const floatingToolbar = (
  cardOptions: CardOptions,
  featureFlags: FeatureFlags,
  platform?: CardPlatform,
  linkPickerOptions?: LinkPickerOptions,
  pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>,
): FloatingToolbarHandler => {
  return (state, intl, providerFactory) => {
    const { inlineCard, blockCard, embedCard } = state.schema.nodes;
    const nodeType = [inlineCard, blockCard, embedCard];
    const pluginState: CardPluginState | undefined = pluginKey.getState(state);
    if (!(state.selection instanceof NodeSelection)) {
      return;
    }
    const selectedNode = state.selection.node;

    if (!selectedNode) {
      return;
    }

    const isEmbedCard = appearanceForNodeType(selectedNode.type) === 'embed';

    /* add an offset to embeds due to extra padding */
    const toolbarOffset: { offset: [number, number] } | {} = isEmbedCard
      ? {
          offset: [0, 24],
        }
      : {};

    // Applies padding override for when link picker is currently displayed
    const className = pluginState?.showLinkingToolbar
      ? FLOATING_TOOLBAR_LINKPICKER_CLASSNAME
      : undefined;

    /**
     * Enable focus trap only if feature flag is enabled AND for the new version of the picker
     */
    const { lpLinkPicker, lpLinkPickerFocusTrap, preventPopupOverflow } =
      featureFlags;

    const shouldEnableFocusTrap = lpLinkPicker && lpLinkPickerFocusTrap;
    const isLinkPickerEnabled = !!lpLinkPicker;

    return {
      title: intl.formatMessage(messages.card),
      className,
      nodeType,
      preventPopupOverflow,
      ...toolbarOffset,
      getDomRef: view => {
        const element = findDomRefAtPos(
          view.state.selection.from,
          view.domAtPos.bind(view),
        ) as HTMLElement;
        if (!element) {
          return undefined;
        }
        if (isEmbedCard) {
          return element.querySelector(`.${richMediaClassName}`) as HTMLElement;
        }
        return element;
      },

      items: generateToolbarItems(
        state,
        featureFlags,
        intl,
        providerFactory,
        cardOptions,
        platform,
        linkPickerOptions,
        pluginInjectionApi,
      ),
      scrollable: pluginState?.showLinkingToolbar ? false : true,
      focusTrap: shouldEnableFocusTrap && pluginState?.showLinkingToolbar,
      ...editLinkToolbarConfig(
        Boolean(pluginState?.showLinkingToolbar),
        isLinkPickerEnabled,
      ),
    };
  };
};

const unlinkCard = (
  node: Node,
  state: EditorState,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): Command => {
  const displayInfo = displayInfoForCard(node, findCardInfo(state));
  const text = displayInfo.title || displayInfo.url;
  if (text) {
    return commandWithMetadata(
      changeSelectedCardToText(text, editorAnalyticsApi),
      {
        action: ACTION.UNLINK,
      },
    );
  }

  return () => false;
};

const buildAlignmentOptions = (
  state: EditorState,
  intl: IntlShape,
  widthPluginDependencyApi: PluginDependenciesAPI<WidthPlugin> | undefined,
  analyticsApi: EditorAnalyticsAPI | undefined,
  cardOptions?: CardOptions,
): FloatingToolbarItem<Command>[] => {
  return buildLayoutButtons(
    state,
    intl,
    state.schema.nodes.embedCard,
    widthPluginDependencyApi,
    analyticsApi,
    true,
    true,
    cardOptions?.allowWrapping,
    cardOptions?.allowAlignment,
  );
};

const withToolbarMetadata = (command: Command) =>
  commandWithMetadata(command, {
    inputMethod: INPUT_METHOD.FLOATING_TB,
  });

const getToolbarViewedItem = (
  url: string | undefined,
  display: string,
): FloatingToolbarItem<never>[] => {
  if (!url) {
    return [];
  }

  if (getBooleanFF('platform.linking-platform.editor.toolbar-viewed-event')) {
    return [
      {
        type: 'custom',
        fallback: [],
        render: editorView => (
          <ToolbarViewedEvent
            key="edit.link.menu.viewed"
            url={url}
            display={display}
            editorView={editorView}
          />
        ),
      },
    ];
  }

  return [];
};

const generateToolbarItems =
  (
    state: EditorState,
    featureFlags: FeatureFlags,
    intl: IntlShape,
    providerFactory: ProviderFactory,
    cardOptions: CardOptions,
    platform?: CardPlatform,
    linkPicker?: LinkPickerOptions,
    pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>,
  ) =>
  (node: Node): Array<FloatingToolbarItem<Command>> => {
    const { url } = titleUrlPairFromNode(node);
    const { actions: editorAnalyticsApi } = pluginInjectionApi?.analytics ?? {};
    let metadata = {};
    if (url && !isSafeUrl(url)) {
      return [];
    } else {
      const { title } = displayInfoForCard(node, findCardInfo(state));
      metadata = {
        url: url,
        title: title,
      };
    }

    const pluginState: CardPluginState | undefined = pluginKey.getState(state);

    const currentAppearance = appearanceForNodeType(node.type);
    const { hoverDecoration } = pluginInjectionApi?.decorations?.actions ?? {};

    const isDatasource =
      currentAppearance === 'block' && node?.attrs?.datasource;
    const shouldRenderDatasourceToolbar =
      isDatasource &&
      // not showing toolbar in mobile for now since not sure what our plans are for it
      platform !== 'mobile' &&
      cardOptions.allowDatasource &&
      canRenderDatasource(node?.attrs?.datasource?.id);

    /* mobile builds toolbar natively using toolbarItems */
    if (pluginState?.showLinkingToolbar && platform !== 'mobile') {
      return [
        buildEditLinkToolbar({
          providerFactory,
          linkPicker,
          node,
          featureFlags,
          pluginInjectionApi,
        }),
      ];
    } else if (shouldRenderDatasourceToolbar) {
      return getDatasourceButtonGroup(
        metadata,
        intl,
        editorAnalyticsApi,
        node,
        hoverDecoration,
        node.attrs.datasource.id,
        state,
      );
    } else {
      const { inlineCard } = state.schema.nodes;
      const toolbarItems: Array<FloatingToolbarItem<Command>> = [
        {
          id: 'editor.link.edit',
          type: 'button',
          selected: false,
          metadata: metadata,
          title: intl.formatMessage(linkToolbarMessages.editLink),
          showTitle: true,
          testId: 'link-toolbar-edit-link-button',
          onClick: editLink(editorAnalyticsApi),
        },
        { type: 'separator' },
        {
          id: 'editor.link.openLink',
          type: 'button',
          icon: OpenIcon,
          metadata: metadata,
          className: 'hyperlink-open-link',
          title: intl.formatMessage(linkMessages.openLink),
          onClick: visitCardLink(editorAnalyticsApi),
        },
        { type: 'separator' },
        ...getUnlinkButtonGroup(
          state,
          intl,
          node,
          inlineCard,
          editorAnalyticsApi,
        ),
        {
          type: 'copy-button',
          items: [
            {
              state,
              formatMessage: intl.formatMessage,
              nodeType: node.type,
            },
            { type: 'separator' },
          ],
        },
        ...getSettingsButtonGroup(
          state,
          featureFlags,
          intl,
          editorAnalyticsApi,
        ),
        {
          id: 'editor.link.delete',
          focusEditoronEnter: true,
          type: 'button',
          appearance: 'danger',
          icon: RemoveIcon,
          onMouseEnter: hoverDecoration?.(node.type, true),
          onMouseLeave: hoverDecoration?.(node.type, false),
          onFocus: hoverDecoration?.(node.type, true),
          onBlur: hoverDecoration?.(node.type, false),
          title: intl.formatMessage(commonMessages.remove),
          onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
        },
      ];

      if (currentAppearance === 'embed') {
        const alignmentOptions = buildAlignmentOptions(
          state,
          intl,
          pluginInjectionApi?.width,
          pluginInjectionApi?.analytics?.actions,
          cardOptions,
        );
        if (alignmentOptions.length) {
          alignmentOptions.push({
            type: 'separator',
          });
        }
        toolbarItems.unshift(...alignmentOptions);
      }
      const { allowBlockCards, allowEmbeds, allowDatasource } = cardOptions;

      // This code will be executed only for appearances such as "inline", "block" & "embed"
      // For url appearance, please see HyperlinkToolbarAppearanceProps
      if (currentAppearance) {
        toolbarItems.unshift(
          ...getToolbarViewedItem(url, currentAppearance),
          {
            type: 'custom',
            fallback: [],
            render: editorView => (
              <LinkToolbarAppearance
                key="link-appearance"
                url={url}
                intl={intl}
                currentAppearance={currentAppearance}
                editorView={editorView}
                editorState={state}
                allowEmbeds={allowEmbeds}
                allowBlockCards={allowBlockCards}
                platform={platform}
                editorAnalyticsApi={editorAnalyticsApi}
                cardActions={pluginInjectionApi?.card.actions}
              />
            ),
          },
          {
            type: 'separator',
          },
        );
      }

      const shouldShowDatasourceEditButton =
        platform !== 'mobile' && allowDatasource;

      if (shouldShowDatasourceEditButton) {
        toolbarItems.unshift({
          type: 'custom',
          fallback: [],
          render: editorView => (
            <EditDatasourceButton
              intl={intl}
              editorAnalyticsApi={editorAnalyticsApi}
              url={url}
              editorView={editorView}
              editorState={state}
            />
          ),
        });
      }

      return toolbarItems;
    }
  };

const getUnlinkButtonGroup = (
  state: EditorState,
  intl: IntlShape,
  node: Node,
  inlineCard: NodeType,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => {
  return node.type === inlineCard
    ? ([
        {
          id: 'editor.link.unlink',
          focusEditoronEnter: true,
          type: 'button',
          title: intl.formatMessage(linkToolbarMessages.unlink),
          icon: UnlinkIcon,
          onClick: withToolbarMetadata(
            unlinkCard(node, state, editorAnalyticsApi),
          ),
        },
        { type: 'separator' },
      ] as Array<FloatingToolbarItem<Command>>)
    : [];
};

const getSettingsButtonGroup = (
  state: EditorState,
  featureFlags: FeatureFlags,
  intl: IntlShape,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
): FloatingToolbarItem<Command>[] => {
  const { floatingToolbarLinkSettingsButton } = featureFlags;
  return floatingToolbarLinkSettingsButton === 'true'
    ? [
        {
          id: 'editor.link.settings',
          type: 'button',
          icon: CogIcon,
          title: intl.formatMessage(linkToolbarMessages.settingsLink),
          onClick: openLinkSettings(editorAnalyticsApi),
        },
        { type: 'separator' },
      ]
    : [];
};

const getDatasourceButtonGroup = (
  metadata: { url: string; title: string } | {},
  intl: IntlShape,
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
  node: Node,
  hoverDecoration: HoverDecorationHandler | undefined,
  datasourceId: string,
  state: EditorState,
): FloatingToolbarItem<Command>[] => {
  const toolbarItems: Array<FloatingToolbarItem<Command>> = [
    {
      id: 'editor.edit.datasource',
      type: 'button',
      icon: SmallerEditIcon,
      metadata: metadata,
      className: 'datasource-edit',
      title: intl.formatMessage(linkToolbarMessages.editDatasource),
      onClick: editDatasource(datasourceId, editorAnalyticsApi),
      testId: 'datasource-edit-button',
    },
  ];

  if (node?.attrs?.url) {
    toolbarItems.push(
      { type: 'separator' },
      {
        id: 'editor.link.openLink',
        type: 'button',
        icon: OpenIcon,
        metadata: metadata,
        className: 'hyperlink-open-link',
        title: intl.formatMessage(linkMessages.openLink),
        onClick: visitCardLink(editorAnalyticsApi),
      },
    );
  }

  toolbarItems.push(
    { type: 'separator' },
    {
      type: 'copy-button',
      items: [
        {
          state,
          formatMessage: intl.formatMessage,
          nodeType: node.type,
        },
        { type: 'separator' },
      ],
    },
    {
      id: 'editor.link.delete',
      focusEditoronEnter: true,
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      onMouseEnter: hoverDecoration?.(node.type, true),
      onMouseLeave: hoverDecoration?.(node.type, false),
      onFocus: hoverDecoration?.(node.type, true),
      onBlur: hoverDecoration?.(node.type, false),
      title: intl.formatMessage(commonMessages.remove),
      onClick: withToolbarMetadata(removeCard(editorAnalyticsApi)),
    },
  );

  return toolbarItems;
};
