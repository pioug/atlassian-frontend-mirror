/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type PropsWithChildren } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage } from 'react-intl-next';

import { fg } from '@atlaskit/platform-feature-flags';
import { N90, N800, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { TOOLTIP_USERS_LIMIT } from '../shared/constants';
import { messages } from '../shared/i18n';
import { type ReactionSummary } from '../types';

import { type OpenReactionsDialogOptions } from './Reactions';

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

// Resets native <button> chrome so it renders as inline text within the tooltip list.
const footerButtonStyle = css({
	backgroundColor: 'transparent',
	border: 'none',
	font: token('font.body.small'),
	display: 'block',
	paddingTop: token('space.0'),
	paddingRight: token('space.0'),
	paddingBottom: token('space.0'),
	paddingLeft: token('space.0'),
	width: '100%',
	textAlign: 'left',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
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
}: ReactionTooltipProps): JSX.Element => {
	const handleClick = () => {
		if (allowUserDialog && handleOpenReactionsDialog) {
			dismissTooltip();
			handleOpenReactionsDialog();
		}
	};

	const content =
		!users || users.length === 0 || !isEnabled ? null : (
			// eslint-disable-next-line @atlassian/a11y/no-noninteractive-tabindex
			<div
				css={tooltipStyle}
				tabIndex={fg('platform_suppression_removal_fix_reactions') ? undefined : 0}
			>
				<ul>
					{emojiName ? <li css={emojiNameStyle}>{emojiName}</li> : null}
					{users.slice(0, maxReactions).map((user) => {
						return <li key={user.id}>{user.displayName}</li>;
					})}
					{/* If count of reactions higher than given threshold then render custom message */}
					{fg('platform_reactions_tooltip_a11y') ? (
						users.length > maxReactions &&
						(allowUserDialog && handleOpenReactionsDialog ? (
							<li>
								<button
									type="button"
									css={[footerButtonStyle, footerStyle, underlineStyle]}
									onClick={handleClick}
								>
									<FormattedMessage
										{...messages.otherUsers}
										values={{
											count: users.length - maxReactions,
										}}
									/>
								</button>
							</li>
						) : (
							<li css={footerStyle}>
								<FormattedMessage
									{...messages.otherUsers}
									values={{
										count: users.length - maxReactions,
									}}
								/>
							</li>
						))
					) : (
						// eslint-disable-next-line @atlassian/a11y/no-noninteractive-element-interactions, @atlassian/a11y/click-events-have-key-events
						<li
							css={[footerStyle, allowUserDialog && underlineStyle]}
							onMouseDown={handleClick}
							onClick={handleClick}
							onKeyDown={fg('platform_suppression_removal_fix_reactions') ? handleClick : undefined}
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
					)}
				</ul>
			</div>
		);

	return (
		<Tooltip content={content} position="bottom" testId={RENDER_REACTIONTOOLTIP_TESTID}>
			{React.Children.only(children)}
		</Tooltip>
	);
};
