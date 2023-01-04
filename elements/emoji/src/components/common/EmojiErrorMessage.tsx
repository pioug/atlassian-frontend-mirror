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

export const emojiErrorMessageTestId = 'emoji-error-message';
export const emojiErrorMessageTooltipTestId = 'emoji-error-message-tooltip';
export const emojiErrorIconTestId = 'emoji-error-icon';

const EmojiErrorMessage: FC<Props> = (props) => {
  const { messageStyles, message, tooltip } = props;

  return tooltip ? (
    <div css={messageStyles} data-testid={emojiErrorMessageTestId}>
      <Tooltip
        content={message}
        position="top"
        testId={emojiErrorMessageTooltipTestId}
      >
        <ErrorIcon label="Error" size="medium" testId={emojiErrorIconTestId} />
      </Tooltip>
    </div>
  ) : (
    <div css={messageStyles} data-testid={emojiErrorMessageTestId}>
      <ErrorIcon label="Error" size="small" /> {message}
    </div>
  );
};

export default EmojiErrorMessage;
