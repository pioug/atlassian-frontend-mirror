/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { Inline } from '@atlaskit/primitives/compiled';
import { jsx } from '@compiled/react';
import Button from '@atlaskit/button/new';
import EditIcon from '@atlaskit/icon/core/edit';
import { useIntl } from 'react-intl-next';
import { messages } from '../../messages';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';

interface Props {
	isDisabled?: boolean;
	onClick?(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void;
}

export const NewChatButton = ({ onClick, isDisabled }: Props) => {
	const { formatMessage } = useIntl();
	return (
		<Button onClick={onClick} isDisabled={isDisabled} testId="new-chat-button">
			<Inline space="space.100" alignBlock="center" alignInline="center">
				<EditIcon color="currentColor" label={'New chat'} />
				{formatMessage(messages.help_panel_new_chat_button)}
			</Inline>
		</Button>
	);
};
