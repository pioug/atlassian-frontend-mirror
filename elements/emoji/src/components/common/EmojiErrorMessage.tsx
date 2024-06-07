/** @jsx jsx */
import { jsx, type SerializedStyles } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import type { Message } from '../../types';
import { useIntl } from 'react-intl-next';

import { messages } from '../i18n';

export interface Props {
	message: Message;
	tooltip?: boolean;
	messageStyles: SerializedStyles;
}

export const emojiErrorScreenreaderTestId = 'emoji-error-screenreader-message';
export const emojiErrorMessageTestId = 'emoji-error-message';
export const emojiErrorMessageTooltipTestId = 'emoji-error-message-tooltip';
export const emojiErrorIconTestId = 'emoji-error-icon';

const EmojiErrorMessage = (props: Props) => {
	const { messageStyles, message, tooltip } = props;

	const { formatMessage } = useIntl();

	const visualContent = tooltip ? (
		<div css={messageStyles} data-testid={emojiErrorMessageTestId}>
			<Tooltip content={message} position="top" testId={emojiErrorMessageTooltipTestId}>
				<ErrorIcon
					label={formatMessage(messages.error)}
					size="medium"
					testId={emojiErrorIconTestId}
				/>
			</Tooltip>
		</div>
	) : (
		<div css={messageStyles} data-testid={emojiErrorMessageTestId}>
			<ErrorIcon label={formatMessage(messages.error)} size="small" />
			{message}
		</div>
	);

	return visualContent;
};

export default EmojiErrorMessage;
