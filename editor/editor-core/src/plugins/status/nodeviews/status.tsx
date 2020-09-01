import React from 'react';

import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';

import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common';
import { Color, Status, StatusStyle } from '@atlaskit/status/element';

import { EventDispatcher } from '../../../event-dispatcher';
import { getPosHandler, ReactNodeView } from '../../../nodeviews';
import InlineNodeWrapper, {
  createMobileInlineDomRef,
} from '../../../ui/InlineNodeWrapper';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { StatusPluginOptions } from '../types';
import { messages } from './messages';

export interface StyledStatusProps {
  placeholderStyle: boolean;
}

export const StyledStatus = styled.span`
  opacity: ${(props: StyledStatusProps) => (props.placeholderStyle ? 0.5 : 1)};
`;

export interface ContainerProps {
  view: EditorView;
  text?: string;
  color: Color;
  style?: StatusStyle;
  localId?: string;

  eventDispatcher?: EventDispatcher;
}

class StatusContainerView extends React.Component<
  ContainerProps & InjectedIntlProps,
  {}
> {
  static displayName = 'StatusContainerView';

  constructor(props: ContainerProps & InjectedIntlProps) {
    super(props);
  }

  render() {
    const {
      text,
      color,
      localId,
      style,
      intl: { formatMessage },
    } = this.props;

    const statusText = text ? text : formatMessage(messages.placeholder);

    return (
      <StyledStatus placeholderStyle={!text}>
        <Status
          text={statusText}
          color={color}
          localId={localId}
          style={style}
          onClick={this.handleClick}
        />
      </StyledStatus>
    );
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
    // handling of popup is done in plugin.apply on selection change.
  };
}

export const IntlStatusContainerView = injectIntl(StatusContainerView);

export interface Props {
  options?: StatusPluginOptions;
}

export class StatusNodeView extends ReactNodeView<Props> {
  createDomRef() {
    if (
      this.reactComponentProps.options &&
      this.reactComponentProps.options.useInlineWrapper
    ) {
      return createMobileInlineDomRef();
    }

    return super.createDomRef();
  }

  setDomAttrs(node: PMNode, element: HTMLElement) {
    const { color, localId, style } = node.attrs;

    element.dataset.color = color;
    element.dataset.localId = localId;
    element.dataset.style = style;
  }

  render(props: Props) {
    const { options } = props;
    const { text, color, localId, style } = this.node.attrs;

    return (
      <InlineNodeWrapper useInlineWrapper={options && options.useInlineWrapper}>
        <IntlStatusContainerView
          view={this.view}
          text={text}
          color={color}
          style={style}
          localId={localId}
        />
        {options && options.allowZeroWidthSpaceAfter && ZERO_WIDTH_SPACE}
      </InlineNodeWrapper>
    );
  }
}

export default function statusNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  options?: StatusPluginOptions,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new StatusNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      options,
    }).init();
}
