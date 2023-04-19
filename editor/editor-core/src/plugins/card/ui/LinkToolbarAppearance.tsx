import { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { ACTION, INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { CardContext } from '@atlaskit/link-provider';
import { CardPlatform } from '@atlaskit/smart-card';
import PropTypes from 'prop-types';
import { Fragment } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import { IntlShape } from 'react-intl-next';
import nodeNames from '../../../messages';
import { isSupportedInParent } from '../../../utils/nodes';
import { messages } from '../messages';
import { commandWithMetadata } from '@atlaskit/editor-common/card';
import {
  changeSelectedCardToLink,
  setSelectedCardAppearance,
} from '../pm-plugins/doc';
import { getButtonGroupOption } from './link-toolbar-button-group-options';
import { LinkToolbarButtonGroup } from './LinkToolbarButtonGroup';
import { OptionConfig } from './types';

export interface LinkToolbarAppearanceProps {
  intl: IntlShape;
  currentAppearance?: CardAppearance;
  editorState: EditorState;
  editorView?: EditorView;
  url?: string;
  allowEmbeds?: boolean;
  allowBlockCards?: boolean;
  platform?: CardPlatform;
}
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
    } = this.props;
    const preview =
      allowEmbeds &&
      cardContext &&
      url &&
      cardContext.extractors.getPreview(url, platform);

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
        onClick: setSelectedCardAppearance('embed'),
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
      onClick: setSelectedCardAppearance('block'),
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
        onClick: commandWithMetadata(changeSelectedCardToLink(url, url, true), {
          action: ACTION.CHANGED_TYPE,
        }),
        selected: !currentAppearance,
        testId: 'url-appearance',
      },
      {
        appearance: 'inline',
        title: intl.formatMessage(messages.inline),
        onClick: setSelectedCardAppearance('inline'),
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
        options={options.map((option) =>
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
