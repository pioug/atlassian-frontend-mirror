/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { EditorView } from 'prosemirror-view';
import { injectIntl, IntlShape } from 'react-intl-next';

import { Color, Status, StatusStyle } from '@atlaskit/status/element';

import { EventDispatcher } from '../../../event-dispatcher';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
import { StatusPluginOptions } from '../types';
import { messages } from './messages';

const styledStatus = css`
  opacity: 1;
`;

const styledStatusPlaceholder = css`
  opacity: 0.5;
`;

export interface ContainerProps {
  view: EditorView;
  intl: IntlShape;
  text?: string;
  color: Color;
  style?: StatusStyle;
  localId?: string;
  eventDispatcher?: EventDispatcher;
}

const StatusContainerView: React.FC<ContainerProps> = (props) => {
  const {
    text,
    color,
    localId,
    style,
    intl: { formatMessage },
  } = props;

  const statusText = text ? text : formatMessage(messages.placeholder);

  const handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
    // handling of popup is done in plugin.apply on selection change.
  };

  return (
    <span css={text ? styledStatus : styledStatusPlaceholder}>
      <Status
        text={statusText}
        color={color}
        localId={localId}
        style={style}
        onClick={handleClick}
      />
    </span>
  );
};

export const IntlStatusContainerView = injectIntl(StatusContainerView);

export type Props = InlineNodeViewComponentProps & {
  options: StatusPluginOptions | undefined;
};

export const StatusNodeView: React.FC<Props> = (props) => {
  const { view } = props;
  const { text, color, localId, style } = props.node.attrs;

  return (
    <IntlStatusContainerView
      view={view}
      text={text}
      color={color}
      style={style}
      localId={localId}
    />
  );
};
