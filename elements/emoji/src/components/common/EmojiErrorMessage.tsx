/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, type SerializedStyles } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import ErrorIcon from '@atlaskit/icon/core/migration/error';
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
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={messageStyles} data-testid={emojiErrorMessageTestId}>
			<Tooltip content={message} position="top" testId={emojiErrorMessageTooltipTestId}>
				<ErrorIcon
					color="currentColor"
					label={formatMessage(messages.error)}
					LEGACY_size="medium"
					spacing="spacious"
					testId={emojiErrorIconTestId}
				/>
			</Tooltip>
		</div>
	) : (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={messageStyles} data-testid={emojiErrorMessageTestId}>
			<ErrorIcon color="currentColor" label={formatMessage(messages.error)} LEGACY_size="small" />
			{message}
		</div>
	);

	return visualContent;
};

export default EmojiErrorMessage;
