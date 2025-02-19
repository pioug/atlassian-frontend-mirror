import React from 'react';

import Tooltip from '@atlaskit/tooltip';
import { Pressable, xcss } from '@atlaskit/primitives';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { useIntl } from 'react-intl-next';

import { messages } from '../../shared/i18n';

const triggerStyles = xcss({
	marginRight: 'space.050',
	marginTop: 'space.050',
	minWidth: '32px',
	height: '24px',
	borderRadius: 'border.radius.100',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const transparentEnabledTriggerStyles = xcss({
	borderColor: 'color.border',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

interface ReactionsDialogTriggerProps {
	onClick: () => void;
}

// Currently not in use due to Reactions Dialog trigger being moved to tooltip
// Similar to platform/packages/elements/reactions/src/components/Trigger/Trigger.tsx
export const ReactionsDialogTrigger = ({ onClick }: ReactionsDialogTriggerProps) => {
	const intl = useIntl();

	return (
		<Pressable
			xcss={[triggerStyles, transparentEnabledTriggerStyles]}
			backgroundColor="color.background.neutral.subtle"
			padding="space.0"
			onClick={onClick}
			aria-label={intl.formatMessage(messages.seeWhoReactedTooltip)}
		>
			<Tooltip content={intl.formatMessage(messages.seeWhoReactedTooltip)}>
				<ShowMoreHorizontalIcon label={intl.formatMessage(messages.seeWhoReacted)} />
			</Tooltip>
		</Pressable>
	);
};
