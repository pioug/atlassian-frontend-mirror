import React from 'react';

import PropTypes from 'prop-types';
import { IntlShape } from 'react-intl-next';

import {
  ACTION,
  EditorAnalyticsAPI,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  CardPluginActions,
  commandWithMetadata,
  getButtonGroupOption,
  LinkToolbarButtonGroup,
  OptionConfig,
} from '@atlaskit/editor-common/card';
import nodeNames, {
  cardMessages as messages,
} from '@atlaskit/editor-common/messages';
import { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { Command } from '@atlaskit/editor-common/types';
import { isSupportedInParent } from '@atlaskit/editor-common/utils';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CardContext } from '@atlaskit/link-provider';
import { CardPlatform } from '@atlaskit/smart-card';

export interface LinkToolbarAppearanceProps {
  intl: IntlShape;
  editorAnalyticsApi: EditorAnalyticsAPI | undefined;
  currentAppearance?: CardAppearance;
  editorState: EditorState;
  editorView?: EditorView;
  url?: string;
  allowEmbeds?: boolean;
  allowBlockCards?: boolean;
  platform?: CardPlatform;
  cardActions: CardPluginActions | undefined;
}
// eslint-disable-next-line @repo/internal/react/no-class-components
export class LinkToolbarAppearance extends React.Component<
  LinkToolbarAppearanceProps,
  {}
> {
  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  renderDropdown = (view?: EditorView, cardContext?: CardContext) => {
    const {
      url,
      intl,
      currentAppearance,
      editorState,
      allowEmbeds,
      allowBlockCards = true,
      platform,
      editorAnalyticsApi,
      cardActions,
    } = this.props;
    const preview =
      allowEmbeds &&
      cardContext &&
      url &&
      cardContext.extractors.getPreview(url, platform);

    const defaultCommand: Command = () => false;

    if (url) {
      const urlState = cardContext?.store?.getState()[url];
      if (urlState?.error?.kind === 'fatal') {
        return null;
      }
    }

    const isBlockCardLinkSupportedInParent = allowBlockCards
      ? isSupportedInParent(
          editorState,
          Fragment.from(editorState.schema.nodes.blockCard.createChecked({})),
          currentAppearance,
        )
      : false;

    const isEmbedCardLinkSupportedInParent = allowEmbeds
      ? isSupportedInParent(
          editorState,
          Fragment.from(editorState.schema.nodes.embedCard.createChecked({})),
          currentAppearance,
        )
      : false;

    const embedOption = allowEmbeds &&
      preview && {
        appearance: 'embed' as const,
        title: intl.formatMessage(messages.embed),
        onClick:
          cardActions?.setSelectedCardAppearance('embed', editorAnalyticsApi) ??
          defaultCommand,
        selected: currentAppearance === 'embed',
        hidden: false,
        testId: 'embed-appearance',
        disabled: !isEmbedCardLinkSupportedInParent,
        tooltip: isEmbedCardLinkSupportedInParent
          ? undefined
          : getUnavailableMessage(editorState, intl),
      };

    const blockCardOption = allowBlockCards && {
      appearance: 'block' as const,
      title: intl.formatMessage(messages.block),
      onClick:
        cardActions?.setSelectedCardAppearance('block', editorAnalyticsApi) ??
        defaultCommand,
      selected: currentAppearance === 'block',
      testId: 'block-appearance',
      disabled: !isBlockCardLinkSupportedInParent,
      tooltip: isBlockCardLinkSupportedInParent
        ? undefined
        : getUnavailableMessage(editorState, intl),
    };

    const options: OptionConfig[] = [
      {
        title: intl.formatMessage(messages.url),
        onClick: commandWithMetadata(
          cardActions?.changeSelectedCardToLink(
            url,
            url,
            true,
            undefined,
            undefined,
            editorAnalyticsApi,
          ) ?? defaultCommand,
          {
            action: ACTION.CHANGED_TYPE,
          },
        ),
        selected: !currentAppearance,
        testId: 'url-appearance',
      },
      {
        appearance: 'inline',
        title: intl.formatMessage(messages.inline),
        onClick:
          cardActions?.setSelectedCardAppearance(
            'inline',
            editorAnalyticsApi,
          ) ?? defaultCommand,
        selected: currentAppearance === 'inline',
        testId: 'inline-appearance',
      },
    ];

    const dispatchCommand = (fn?: Function) => {
      fn && fn(editorState, view && view.dispatch);
      // Refocus the view to ensure the editor has focus
      if (view && !view.hasFocus()) {
        view.focus();
      }
    };

    if (blockCardOption) {
      options.push(blockCardOption);
    }

    if (embedOption) {
      options.push(embedOption);
    }

    return (
      <LinkToolbarButtonGroup
        key="link-toolbar-button-group"
        options={options.map(option =>
          getButtonGroupOption(intl, dispatchCommand, {
            ...option,
            onClick: commandWithMetadata(option.onClick, {
              inputMethod: INPUT_METHOD.FLOATING_TB,
            }),
          }),
        )}
      />
    );
  };

  render() {
    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;
    const { editorView } = this.props;

    return this.renderDropdown(editorView, cardContext && cardContext.value);
  }
}

const getUnavailableMessage = (state: EditorState, intl: IntlShape): string => {
  try {
    const parentNode = state.selection.$from.node(1);
    const parentName = intl.formatMessage(
      nodeNames[parentNode.type.name as keyof typeof nodeNames],
    );
    const tooltip = intl.formatMessage(
      messages.displayOptionUnavailableInParentNode,
      {
        node: parentName,
      },
    );
    return tooltip;
  } catch (e) {
    return intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
      node: intl.formatMessage(nodeNames.defaultBlockNode),
    });
  }
};
