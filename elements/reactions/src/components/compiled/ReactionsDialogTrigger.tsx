/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import Tooltip from '@atlaskit/tooltip';
import { cssMap, cx, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Pressable } from '@atlaskit/primitives/compiled';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { useIntl } from 'react-intl-next';

import { messages } from '../../shared/i18n';

const styles = cssMap({
	trigger: {
		marginRight: token('space.050'),
		marginTop: token('space.050'),
		minWidth: '32px',
		height: '24px',
		borderRadius: token('border.radius.100'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: token('color.background.neutral.subtle'),
		paddingTop: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		paddingRight: token('space.0'),
	},

	transparentEnabledTrigger: {
		borderColor: token('color.border'),

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
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
			xcss={cx(styles.trigger, styles.transparentEnabledTrigger)}
			onClick={onClick}
			aria-label={intl.formatMessage(messages.seeWhoReactedTooltip)}
		>
			<Tooltip content={intl.formatMessage(messages.seeWhoReactedTooltip)}>
				<ShowMoreHorizontalIcon label={intl.formatMessage(messages.seeWhoReacted)} />
			</Tooltip>
		</Pressable>
	);
};
