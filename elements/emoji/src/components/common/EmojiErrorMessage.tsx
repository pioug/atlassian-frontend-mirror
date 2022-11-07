/** @jsx jsx */
import { FC } from 'react';
import { jsx, SerializedStyles } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Message } from '../../types';

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
