/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import type { SyntheticEvent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { WithIntlProps, WrappedComponentProps } from 'react-intl';
import { FormattedMessage, injectIntl } from 'react-intl';

import { css, cssMap, jsx } from '@atlaskit/css';
import { mentionMessages as messages } from '@atlaskit/editor-common/messages';
import EmailIcon from '@atlaskit/icon/core/email';
import StatusErrorIcon from '@atlaskit/icon/core/status-error';
import type { UserRole } from '@atlaskit/mention';
import type { MentionDescription } from '@atlaskit/mention/resource';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import Pressable from '@atlaskit/primitives/pressable';
import { token } from '@atlaskit/tokens';
import { isValidEmail } from '@atlaskit/user-picker';

const mentionItemStyle = css({
	backgroundColor: 'transparent',
	display: 'block',
	overflow: 'hidden',
	listStyleType: 'none',
});

const mentionItemSelectedStyle = css({
	backgroundColor: token('color.background.neutral.subtle.hovered'),
});

const displayNameStyles = cssMap({
	localPart: {
		overflowWrap: 'break-word',
	},
	domainPart: {
		display: 'inline-block',
		maxWidth: '100%',
		overflowWrap: 'break-word',
	},
});

const DisplayName = ({ name }: { name: string }) => {
	const atIndex = name.indexOf('@');
	if (atIndex === -1) {
		return <span css={displayNameStyles.localPart}>{name}</span>;
	}
	const localPart = name.slice(0, atIndex);
	const domainPart = name.slice(atIndex); // includes the @
	return (
		<div>
			<span css={displayNameStyles.localPart}>{localPart}</span>
			<span css={displayNameStyles.domainPart}>{domainPart}</span>
		</div>
	);
};

const style = cssMap({
	byline: {
		marginTop: token('space.025'),
	},
	rowStyle: {
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		overflow: 'hidden',
		paddingTop: token('space.075'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		paddingRight: token('space.150'),
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
		marginLeft: token('space.150'),
		marginRight: token('space.100'),
		color: token('color.text.subtle'),
	},
	capitalize: {
		textTransform: 'capitalize',
	},
	// Same as Button component except alignSelf: 'center' instead of 'baseline'
	inviteButton: {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: token('space.075'),
		paddingRight: token('space.150'),
		paddingBottom: token('space.075'),
		paddingLeft: token('space.150'),
		borderRadius: token('radius.small'),
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		color: token('color.text.subtle'),
		font: token('font.body'),
		fontWeight: token('font.weight.medium'),
		height: '2rem',
		backgroundColor: token('color.background.neutral.subtle'),
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:disabled': {
			backgroundColor: token('color.background.disabled'),
		},
	},
});

const VALID_OPTION = 'VALID';
const POTENTIAL_OPTION = 'POTENTIAL';
// eslint-disable-next-line require-unicode-regexp
const COMPLETE_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const ERROR_DELAY_MS = 750;

/**
 * Truncates an email-like string to fit within a max length by inserting an
 * ellipsis into the middle of the local part (before the @).
 *
 * Preserves the full `@domain` suffix so users can always see
 * which domain the invite targets.
 */
export const truncateInviteOption = (value: string, maxLength: number = 34): string => {
	if (value.length <= maxLength) {
		return value;
	}

	const atIndex = value.lastIndexOf('@');
	if (atIndex === -1) {
		// No @ — truncate to maxLength and append ellipsis
		const ellipsis = '\u2026';
		return `${value.slice(0, maxLength - 1)}${ellipsis}`;
	}

	const domain = value.slice(atIndex); // includes @
	const local = value.slice(0, atIndex);
	const ellipsis = '\u2026';

	const available = maxLength - domain.length - ellipsis.length;
	if (available <= 0) {
		// Domain alone exceeds budget — show as much as we can
		return `${ellipsis}${domain.slice(-(maxLength - ellipsis.length))}`;
	}

	const leading = Math.ceil(available / 2);
	const trailing = Math.floor(available / 2);
	const truncatedLocal =
		trailing > 0
			? `${local.slice(0, leading)}${ellipsis}${local.slice(local.length - trailing)}`
			: `${local.slice(0, leading)}${ellipsis}`;

	return `${truncatedLocal}${domain}`;
};

const getInviteOption = (inputValue: string, suggestedEmailDomain?: string): string => {
	if (inputValue.includes(' ') && inputValue.includes('@')) {
		return truncateInviteOption(inputValue);
	}
	const isEmail = inputValue && [VALID_OPTION, POTENTIAL_OPTION].includes(isValidEmail(inputValue));
	if (isEmail || !suggestedEmailDomain) {
		return truncateInviteOption(inputValue);
	}
	return truncateInviteOption(`${inputValue.toLocaleLowerCase()}@${suggestedEmailDomain}`);
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
	const [showErrorIcon, setShowErrorIcon] = useState(query.length !== 0 && !getIsEmailValid(query));
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const possibleEmail = getInviteOption(query, emailDomain);
	const isEmailValid = getIsEmailValid(query);

	const getByline = (): React.ReactNode => {
		if (showErrorIcon) {
			return intl.formatMessage(messages.inviteTeammateInvalidEmail);
		}
		if (userRole === 'admin') {
			return (
				<FormattedMessage
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...messages.inviteItemTitle}
					// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
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

	const onInviteButtonClick = useCallback(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(event: React.MouseEvent<any>) => {
			if (onSelection) {
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

	return (
		displayName && (
			<div
				css={[mentionItemStyle, selected && mentionItemSelectedStyle]}
				onMouseEnter={onItemMouseEnter}
				onFocus={onItemFocus}
				data-id={INVITE_ITEM_DESCRIPTION.id}
			>
				<div css={style.rowStyle}>
					<span css={style.avatar}>
						{showErrorIcon ? (
							<StatusErrorIcon label="Error" color={token('color.icon.danger')} />
						) : (
							<EmailIcon label="Email" color={token('color.icon.subtle')} />
						)}
					</span>
					<div css={style.nameSection} data-testid="name-section">
						<DisplayName name={displayName} />
						<div css={style.byline}>{getByline()}</div>
					</div>
					<Pressable
						onClick={onInviteButtonClick}
						xcss={style.inviteButton}
						isDisabled={showErrorIcon}
					>
						{intl.formatMessage(messages.inviteButton)}
					</Pressable>
				</div>
			</div>
		)
	);
};

// eslint-disable-next-line @typescript-eslint/ban-types
const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(InviteItemWithEmailDomain);
export default _default_1;
