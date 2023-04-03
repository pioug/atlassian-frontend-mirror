/** @jsx jsx */
import { FC, Fragment } from 'react';
import { jsx, SerializedStyles } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { Message } from '../../types';
import VisuallyHidden from '@atlaskit/visually-hidden';

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

  const visualContent = tooltip ? (
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
      <ErrorIcon label="Error" size="small" />
      {message}
    </div>
  );

  return (
    <Fragment>
      <VisuallyHidden role="alert">{message}</VisuallyHidden>
      {visualContent}
    </Fragment>
  );
};

export default EmojiErrorMessage;
