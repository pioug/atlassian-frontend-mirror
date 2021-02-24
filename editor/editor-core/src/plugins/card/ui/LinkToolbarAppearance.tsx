import React from 'react';
import PropTypes from 'prop-types';
import { InjectedIntl } from 'react-intl';
import { EditorState } from 'prosemirror-state';
import { CardContext, CardPlatform } from '@atlaskit/smart-card';
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
import { DropdownOptions } from '../../../plugins/floating-toolbar/ui/types';

export interface LinkToolbarAppearanceProps {
  intl: InjectedIntl;
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

    const isSmartLinkSupportedInParent = isSupportedInParent(
      editorState,
      Fragment.from(editorState.schema.nodes.blockCard.createChecked({})),
      currentAppearance,
    );
    const tooltip = isSmartLinkSupportedInParent
      ? undefined
      : parentNodeName(editorState, intl);
    const embedOption = allowEmbeds &&
      preview && {
        title: intl.formatMessage(messages.embed),
        onClick: setSelectedCardAppearance('embed'),
        selected: currentAppearance === 'embed',
        hidden: false,
        testId: 'embed-appearance',
        disabled: !isSmartLinkSupportedInParent,
        tooltip,
      };
    const options: DropdownOptions<Function> = [
      {
        title: intl.formatMessage(messages.url),
        onClick: () =>
          changeSelectedCardToLink(url, url, true)(editorState, view?.dispatch),
        selected: !currentAppearance,
        testId: 'url-appearance',
      },
      {
        title: intl.formatMessage(messages.inline),
        onClick: setSelectedCardAppearance('inline'),
        selected: currentAppearance === 'inline',
        hidden: false,
        testId: 'inline-appearance',
      },
      {
        title: intl.formatMessage(messages.block),
        onClick: setSelectedCardAppearance('block'),
        selected: currentAppearance === 'block',
        hidden: false,
        testId: 'block-appearance',
        disabled: !isSmartLinkSupportedInParent,
        tooltip,
      },
    ];
    const title = intl.formatMessage(
      currentAppearance ? messages[currentAppearance] : messages.url,
    );
    const dispatchCommand = (fn?: Function) => {
      fn && fn(editorState, view && view.dispatch);
    };

    if (embedOption) {
      options.push(embedOption);
    }

    return (
      <Dropdown
        key={'link-toolbar'}
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

const parentNodeName = (state: EditorState, intl: InjectedIntl): string => {
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
