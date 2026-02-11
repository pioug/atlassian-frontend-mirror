/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import type { SyntheticEvent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { css, cssMap, jsx } from '@atlaskit/css';
import { mentionMessages as messages } from '@atlaskit/editor-common/messages';
import EmailIcon from '@atlaskit/icon/core/email';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import type { UserRole } from '@atlaskit/mention';
import type { MentionDescription } from '@atlaskit/mention/resource';
import { N30, N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { isValidEmail } from '@atlaskit/user-picker';

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

const style = cssMap({
	byline: {
		marginTop: token('space.025', '2px'),
	},
	rowStyle: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		overflow: 'hidden',
		paddingTop: token('space.075', '6px'),
		paddingBottom: token('space.075', '6px'),
		paddingLeft: token('space.150', '12px'),
		paddingRight: token('space.150', '12px'),
		textOverflow: 'ellipsis',
		verticalAlign: 'middle',
	},
	avatar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		// flex: 'initial' is wrongly expanded to '1 1 auto', so specify the values explicitly
		flex: '0 1 auto',
		width: '36px',
		height: '36px',
	},
	nameSection: {
		flex: 1,
		minWidth: '0px',
		marginLeft: token('space.150', '12px'),
		color: token('color.text.subtle', N300),
	},
	capitalize: {
		textTransform: 'capitalize',
	},
});

const VALID_OPTION = 'VALID';
const POTENTIAL_OPTION = 'POTENTIAL';
// eslint-disable-next-line require-unicode-regexp
const COMPLETE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const ERROR_DELAY_MS = 750;

const getInviteOption = (inputValue: string, suggestedEmailDomain?: string): string => {
	if (inputValue.includes(' ') && inputValue.includes('@')) {
		return inputValue;
	}
	const isEmail = inputValue && [VALID_OPTION, POTENTIAL_OPTION].includes(isValidEmail(inputValue));
	if (isEmail || !suggestedEmailDomain) {
		return inputValue;
	}
	return `${inputValue.toLocaleLowerCase()}@${suggestedEmailDomain}`;
};

const getIsEmailValid = (inputValue: string): boolean => {
	if (!inputValue || inputValue.length === 0) {
		return false;
	}
	if (inputValue.includes(' ')) {
		return false;
	}
	if (inputValue.includes('@') && !COMPLETE_EMAIL_REGEX.test(inputValue)) {
		return false;
	}
	return true;
};

interface OnMentionEvent {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export const INVITE_ITEM_DESCRIPTION = { id: 'invite-teammate' };

interface Props {
	emailDomain?: string;
	onMount?: () => void;
	onMouseEnter?: OnMentionEvent;
	onSelection?: OnMentionEvent;
	productName?: string;
	query?: string;
	selected?: boolean;
	userRole?: UserRole;
}

const InviteItemWithEmailDomain = ({
	productName,
	onMount,
	onMouseEnter,
	onSelection,
	selected,
	userRole,
	query = '',
	emailDomain,
	intl,
}: Props & WrappedComponentProps) => {
	const [showErrorIcon, setShowErrorIcon] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const possibleEmail = getInviteOption(query, emailDomain);
	const isEmailValid = getIsEmailValid(query);

	// Use debounced error state for icon and byline display
	const shouldShowError = !isEmailValid && showErrorIcon;
	// Use debounced error state for byline: show invalid message only after delay
	const isValidForByline = isEmailValid || !shouldShowError;

	const getByline = (): React.ReactNode => {
		if (!isValidForByline) {
			return intl.formatMessage(messages.inviteTeammateInvalidEmail);
		}
		if (userRole === 'admin') {
			return (
				<FormattedMessage
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...messages.inviteItemTitle}
					values={{
						userRole: userRole || 'basic',
						productName: (
							<span css={style.capitalize} data-testid="capitalized-message">
								{productName}
							</span>
						),
					}}
				/>
			);
		}
		return intl.formatMessage(messages.sendInvite);
	};

	const onSelected = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.MouseEvent<any> | React.KeyboardEvent<any>) => {
			if (onSelection) {
				// For mouse events, only handle left click
				if ('button' in event && event.button !== 0) {
					return;
				}
				// For keyboard events, only handle Enter and Space
				if ('key' in event && event.key !== 'Enter' && event.key !== ' ') {
					return;
				}
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

	const onItemFocus = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.FocusEvent<any>) => {
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

	// Debounce error icon display: only show error after user stops typing invalid input
	useEffect(() => {
		// Clear existing timeout
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = undefined;
		}

		// Reset error icon immediately if input becomes valid or empty
		if (isEmailValid || query.length === 0) {
			setShowErrorIcon(false);
		} else {
			// Debounce: only show error icon after delay if input remains invalid
			timeoutRef.current = setTimeout(() => {
				setShowErrorIcon(true);
			}, ERROR_DELAY_MS);
		}

		// Cleanup timeout on unmount or when query changes
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [query, isEmailValid]);

	const displayName = query && emailDomain ? possibleEmail : undefined;

	return displayName && (
			<div
			role="button"
			tabIndex={0}
			css={[mentionItemStyle, selected && mentionItemSelectedStyle]}
			onMouseDown={onSelected}
			onKeyDown={onSelected}
			onMouseEnter={onItemMouseEnter}
			onFocus={onItemFocus}
			data-id={INVITE_ITEM_DESCRIPTION.id}
		>
			<div css={style.rowStyle}>
				<span css={style.avatar}>
					{shouldShowError ? (
						<StatusErrorIcon label="Error" color={token('color.icon.danger')} />
					) : (
						<EmailIcon label="Email" color={token('color.icon.subtle', N300)} />
					)}
				</span>
				<div css={style.nameSection} data-testid="name-section">
						<>
							<div>{displayName}</div>
							<div css={style.byline}>{getByline()}</div>
						</>
				</div>
			</div>
		</div>
	);
};

export default injectIntl(InviteItemWithEmailDomain);
