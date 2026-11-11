/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { ErrorMessage } from '@atlaskit/form/error-message';
import ErrorIcon from '@atlaskit/icon/core/status-error';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip/Tooltip';

import type { Message } from '../../types';
import { messages } from '../i18n';

export type ErrorStyle = 'chooseFile' | 'delete' | 'preview';

const errorMessageStyles = cssMap({
	chooseFile: {
		display: 'flex',
		color: token('color.text.danger'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingRight: '10px',
		justifyContent: 'flex-start',
	},
	delete: {
		display: 'flex',
		color: token('color.text.danger'),
		alignItems: 'center',
		justifyContent: 'flex-end',
		paddingRight: token('space.050'),
	},
	preview: {
		display: 'inline-flex',
		color: token('color.text.danger'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
		paddingRight: '10px',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});

export interface Props {
	errorStyle: ErrorStyle;
	message: Message;
	tooltip?: boolean;
}

export const emojiErrorScreenreaderTestId = 'emoji-error-screenreader-message';
export const emojiErrorMessageTestId = 'emoji-error-message';
export const emojiErrorMessageTooltipTestId = 'emoji-error-message-tooltip';
export const emojiErrorIconTestId = 'emoji-error-icon';

const EmojiErrorMessage = (props: Props): JSX.Element => {
	const { errorStyle, message, tooltip } = props;

	const { formatMessage } = useIntl();

	const visualContent = tooltip ? (
		<div css={errorMessageStyles[errorStyle]} data-testid={emojiErrorMessageTestId}>
			<Tooltip content={message} position="top" testId={emojiErrorMessageTooltipTestId}>
				<ErrorIcon
					color="currentColor"
					label={formatMessage(messages.error)}
					spacing="spacious"
					testId={emojiErrorIconTestId}
				/>
			</Tooltip>
		</div>
	) : (
		<div data-testid={emojiErrorMessageTestId}>
			<ErrorMessage
				iconLabel={
					fg('platform_ally_emoji_fixes_various') ? formatMessage(messages.error) : undefined
				}
			>
				{message}
			</ErrorMessage>
		</div>
	);

	return visualContent;
};

export default EmojiErrorMessage;
