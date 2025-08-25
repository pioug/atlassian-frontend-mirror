/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren } from 'react';
import { css, jsx } from '@compiled/react';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl-next';
import { TOOLTIP_USERS_LIMIT } from '../shared/constants';
import { messages } from '../shared/i18n';
import { type ReactionSummary } from '../types';
import { type OpenReactionsDialogOptions } from './Reactions';
import { N90, N800, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

export const verticalMargin = 5;
const tooltipStyle = css({
	maxWidth: '150px',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	marginBottom: verticalMargin,

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	ul: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		textAlign: 'left',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	li: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginTop: verticalMargin,
	},
});

const emojiNameStyle = css({
	textTransform: 'capitalize',
	color: token('color.text.inverse', N90),
	fontWeight: token('font.weight.semibold'),
});

const footerStyle = css({
	color: token('color.text.inverse', N90),
});

const underlineStyle = css({
	cursor: 'pointer',
	textDecoration: 'underline',
	'&:hover': {
		backgroundColor: token('color.background.neutral.bold', N800),
		color: token('color.text.inverse', N0),
	},
});

/**
 * Test id for wrapper ReactionTooltip div
 */
export const RENDER_REACTIONTOOLTIP_TESTID = 'render-reactionTooltip';

export type ReactionTooltipProps = PropsWithChildren<{
	/**
	 * Optional prop for enabling the Reactions Dialog
	 */
	allowUserDialog?: boolean;
	/**
	 * Function that hides the tooltip
	 */
	dismissTooltip: () => void;
	/**
	 * Optional name for the reaction emoji
	 */
	emojiName?: string;
	/**
	 * Optional function when the user wants to open the Reactions Dialog
	 */
	handleOpenReactionsDialog?: (options?: OpenReactionsDialogOptions) => void;
	/**
	 * Optional flag for enabling tooltip (defaults to true)
	 */
	isEnabled?: boolean;
	/**
	 * Optional Max users to show in the displayed tooltip (defaults to 5)
	 */
	maxReactions?: number;
	/**
	 * Info on the emoji reaction to render
	 */
	reaction: ReactionSummary;
}>;

export const ReactionTooltip = ({
	children,
	emojiName,
	reaction: { users = [] },
	maxReactions = TOOLTIP_USERS_LIMIT,
	isEnabled = true,
	allowUserDialog,
	handleOpenReactionsDialog,
	dismissTooltip,
}: ReactionTooltipProps) => {
	const handleClick = () => {
		if (allowUserDialog && handleOpenReactionsDialog) {
			dismissTooltip();
			handleOpenReactionsDialog();
		}
	};

	const content =
		!users || users.length === 0 || !isEnabled ? null : (
			// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
			<div css={tooltipStyle} tabIndex={0}>
				<ul>
					{emojiName ? <li css={emojiNameStyle}>{emojiName}</li> : null}
					{users.slice(0, maxReactions).map((user) => {
						return <li key={user.id}>{user.displayName}</li>;
					})}
					{/* If count of reactions higher then given threshold then render custom message */}

					{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
					<li
						css={[footerStyle, allowUserDialog && underlineStyle]}
						onMouseDown={handleClick}
						onClick={handleClick}
					>
						{users.length > maxReactions && (
							<FormattedMessage
								{...messages.otherUsers}
								values={{
									count: users.length - maxReactions,
								}}
							/>
						)}
					</li>
				</ul>
			</div>
		);

	return (
		<Tooltip content={content} position="bottom" testId={RENDER_REACTIONTOOLTIP_TESTID}>
			{React.Children.only(children)}
		</Tooltip>
	);
};
