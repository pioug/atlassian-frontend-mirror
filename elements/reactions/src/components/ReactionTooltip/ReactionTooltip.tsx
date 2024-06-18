/** @jsx jsx */
import React, { type PropsWithChildren } from 'react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import Tooltip from '@atlaskit/tooltip';
import { FormattedMessage } from 'react-intl-next';
import { TOOLTIP_USERS_LIMIT } from '../../shared/constants';
import { messages } from '../../shared/i18n';
import { type ReactionSummary } from '../../types';
import { emojiNameStyle, footerStyle, tooltipStyle, underlineStyle } from './styles';

/**
 * Test id for wrapper ReactionTooltip div
 */
export const RENDER_REACTIONTOOLTIP_TESTID = 'render-reactionTooltip';

export type ReactionTooltipProps = PropsWithChildren<{
	/**
	 * Optional name for the reaction emoji
	 */
	emojiName?: string;
	/**
	 * Info on the emoji reaction to render
	 */
	reaction: ReactionSummary;
	/**
	 * Optional Max users to show in the displayed tooltip (defaults to 5)
	 */
	maxReactions?: number;
	/**
	 * Optional function when the user wants to see more users in a modal
	 */
	handleUserListClick?: (emojiId: string) => void;
	/**
	 * Optional flag to show reactions dialog (defaults to false)
	 */
	allowUserDialog?: boolean;
	/**
	 * Optional flag for enabling tooltip (defaults to true)
	 */
	isEnabled?: boolean;
}>;

export const ReactionTooltip = ({
	children,
	emojiName,
	reaction: { users = [], emojiId = '' },
	maxReactions = TOOLTIP_USERS_LIMIT,
	handleUserListClick,
	allowUserDialog = false,
	isEnabled = true,
}: ReactionTooltipProps) => {
	/**
	 * Render list of users in the tooltip box
	 */
	const content =
		!users || users.length === 0 || !isEnabled ? null : (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<div css={tooltipStyle} tabIndex={0}>
				<ul>
					{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
					{emojiName ? <li css={emojiNameStyle}>{emojiName}</li> : null}
					{users.slice(0, maxReactions).map((user) => {
						return <li key={user.id}>{user.displayName}</li>;
					})}
					{/* If count of reactions higher then given threshold then render custom message */}

					<li
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={allowUserDialog ? [footerStyle, underlineStyle] : footerStyle}
						onClick={() => {
							if (allowUserDialog && handleUserListClick) {
								handleUserListClick(emojiId);
							}
						}}
					>
						{users.length > maxReactions ? (
							<FormattedMessage
								{...messages.otherUsers}
								values={{
									count: users.length - maxReactions,
								}}
							/>
						) : (
							allowUserDialog && <FormattedMessage {...messages.moreInfo} />
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
