/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { MouseEvent, SyntheticEvent } from 'react';
import React, { useCallback, useEffect } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import { mentionMessages as messages } from '@atlaskit/editor-common/messages';
import AddIcon from '@atlaskit/icon/core/migration/add';
import type { UserRole } from '@atlaskit/mention';
import type { MentionDescription } from '@atlaskit/mention/resource';
import { N30, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const mentionItemStyle = css({
	backgroundColor: 'transparent',
	display: 'block',
	overflow: 'hidden',
	listStyleType: 'none',
	cursor: 'pointer',
});

const mentionItemSelectedStyle = css({
	backgroundColor: token('color.background.neutral.subtle.hovered', N30),
});

const rowStyle = css({
	alignItems: 'center',
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	overflow: 'hidden',
	paddingTop: token('space.075', '6px'),
	paddingBottom: token('space.075', '6px'),
	// @ts-expect-error - TODO should use token here, https://product-fabric.atlassian.net/browse/EDF-2517
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingLeft: '14px',
	// @ts-expect-error - TODO should use token here, https://product-fabric.atlassian.net/browse/EDF-2517
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	paddingRight: '14px',
	textOverflow: 'ellipsis',
	verticalAlign: 'middle',
});

const avatarStyle = css({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	position: 'relative',
	// flex: 'initial' is wrongly expanded to '1 1 auto', so specify the values explicitly
	flex: '0 1 auto',
	width: '36px',
	height: '36px',
});

const nameSectionStyle = css({
	flex: 1,
	minWidth: '0px',
	// @ts-expect-error - TODO should use token here, https://product-fabric.atlassian.net/browse/EDF-2517
	// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
	marginLeft: '14px',
	color: token('color.text.subtle', N300),
});

const capitalizedStyle = css({
	textTransform: 'capitalize',
});

interface OnMentionEvent {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export const INVITE_ITEM_DESCRIPTION = { id: 'invite-teammate' };

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const leftClick = (event: MouseEvent<any>): boolean => {
	return event.button === 0 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey;
};

interface Props {
	onMount?: () => void;
	onMouseEnter?: OnMentionEvent;
	onSelection?: OnMentionEvent;
	productName?: string;
	selected?: boolean;
	userRole?: UserRole;
}

const InviteItem = ({
	productName,
	onMount,
	onMouseEnter,
	onSelection,
	selected,
	userRole,
	intl,
}: Props & WrappedComponentProps) => {
	const onSelected = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.MouseEvent<any>) => {
			if (leftClick(event) && onSelection) {
				event.preventDefault();
				onSelection(INVITE_ITEM_DESCRIPTION, event);
			}
		},
		[onSelection],
	);

	const onItemMouseEnter = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.MouseEvent<any>) => {
			if (onMouseEnter) {
				onMouseEnter(INVITE_ITEM_DESCRIPTION, event);
			}
		},
		[onMouseEnter],
	);

	useEffect(() => {
		if (onMount) {
			onMount();
		}
	}, [onMount]);

	return (
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[mentionItemStyle, selected && mentionItemSelectedStyle]}
			onMouseDown={onSelected}
			// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
			onMouseEnter={onItemMouseEnter}
			data-id={INVITE_ITEM_DESCRIPTION.id}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<div css={rowStyle}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<span css={avatarStyle}>
					<AddIcon
						label={intl.formatMessage(messages.mentionsAddLabel)}
						color={token('color.icon.subtle', N300)}
					/>
				</span>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={nameSectionStyle} data-testid="name-section">
					<FormattedMessage
						// Ignored via go/ees005
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...messages.inviteItemTitle}
						values={{
							userRole: userRole || 'basic',
							productName: (
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								<span css={capitalizedStyle} data-testid="capitalized-message">
									{productName}
								</span>
							),
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default injectIntl(InviteItem);
