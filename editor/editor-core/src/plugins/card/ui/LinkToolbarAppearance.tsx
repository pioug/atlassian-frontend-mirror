import React from 'react';
import PropTypes from 'prop-types';
import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { CardPlatform } from '@atlaskit/smart-card';
import { CardContext } from '@atlaskit/link-provider';
import { EditorView } from 'prosemirror-view';
import { Fragment } from 'prosemirror-model';
import {
  setSelectedCardAppearance,
  changeSelectedCardToLink,
} from '../pm-plugins/doc';
import { CardAppearance } from '@atlaskit/editor-common/provider-factory';
import { isSupportedInParent } from '../../../utils/nodes';
import Dropdown from '../../floating-toolbar/ui/Dropdown';
import { messages } from '../messages';
import nodeNames from '../../../messages';
import { getFeatureFlags } from '../../../plugins/feature-flags-context';
import { LinkToolbarIconDropdown } from './LinkToolbarIconDropdown';
import { LinkToolbarButtonGroup } from './LinkToolbarButtonGroup';
import { getButtonGroupOption } from './link-toolbar-button-group-options';
import { OptionConfig } from './types';
import { getIconDropdownOption } from './link-toolbar-icon-dropdown-options';

export interface LinkToolbarAppearanceProps {
  intl: IntlShape;
  currentAppearance?: CardAppearance;
  editorState: EditorState;
  editorView?: EditorView;
  url?: string;
  allowEmbeds?: boolean;
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

    const isBlockCardLinkSupportedInParent = isSupportedInParent(
      editorState,
      Fragment.from(editorState.schema.nodes.blockCard.createChecked({})),
      currentAppearance,
    );

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
    const options: OptionConfig[] = [
      {
        title: intl.formatMessage(messages.url),
        onClick: () =>
          changeSelectedCardToLink(url, url, true)(editorState, view?.dispatch),
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
      {
        appearance: 'block',
        title: intl.formatMessage(messages.block),
        onClick: setSelectedCardAppearance('block'),
        selected: currentAppearance === 'block',
        testId: 'block-appearance',
        disabled: !isBlockCardLinkSupportedInParent,
        tooltip: isBlockCardLinkSupportedInParent
          ? undefined
          : getUnavailableMessage(editorState, intl),
      },
    ];

    const dispatchCommand = (fn?: Function) => {
      fn && fn(editorState, view && view.dispatch);
      // Refocus the view to ensure the editor has focus
      if (view && !view.hasFocus()) {
        view.focus();
      }
    };

    if (embedOption) {
      options.push(embedOption);
    }

    const { viewChangingExperimentToolbarStyle } = getFeatureFlags(editorState);

    if (viewChangingExperimentToolbarStyle === 'toolbarIcons') {
      return (
        <LinkToolbarButtonGroup
          key="link-toolbar-button-group"
          options={options.map((option) =>
            getButtonGroupOption(intl, dispatchCommand, option),
          )}
        />
      );
    }

    if (viewChangingExperimentToolbarStyle === 'newDropdown') {
      return (
        <LinkToolbarIconDropdown
          key="link-toolbar-icon-dropdown"
          title="Change view"
          buttonTestId="link-toolbar-appearance-button"
          dispatchCommand={dispatchCommand}
          options={options.map((option) =>
            getIconDropdownOption(intl, dispatchCommand, option),
          )}
        />
      );
    }

    const title = intl.formatMessage(
      currentAppearance ? messages[currentAppearance] : messages.url,
    );

    return (
      <Dropdown
        key="link-toolbar"
        buttonTestId="link-toolbar-appearance-button"
        title={title}
        dispatchCommand={dispatchCommand}
        options={options}
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
