/** @jsx jsx */
import { jsx } from '@emotion/core';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { FC } from 'react';
import { Message } from '../../types';
import Tooltip from '@atlaskit/tooltip';
import { SerializedStyles } from '@emotion/core';

export interface Props {
  message: Message;
  tooltip?: boolean;
  messageStyles: SerializedStyles;
}

const EmojiErrorMessage: FC<Props> = (props) => {
  const { messageStyles, message, tooltip } = props;

  return tooltip ? (
    <div css={messageStyles}>
      <Tooltip content={message} position="top">
        <ErrorIcon label="Error" size="medium" />
      </Tooltip>
    </div>
  ) : (
    <div css={messageStyles}>
      <ErrorIcon label="Error" size="small" /> {message}
    </div>
  );
};

export default EmojiErrorMessage;
