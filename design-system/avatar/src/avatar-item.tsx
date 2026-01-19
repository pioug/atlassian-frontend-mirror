/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, forwardRef, Fragment, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { type AvatarClickEventHandler } from './types';
import { getCustomElement } from './utilities';

const bgColorCssVar = '--avatar-item-bg-color';

const styles = cssMap({
	root: {
		display: 'flex',
		boxSizing: 'border-box',
		width: '100%',
		alignItems: 'center',
		backgroundColor: `var(${bgColorCssVar})`,
		borderColor: 'transparent',
		borderRadius: token('radius.small', '3px'),
		borderStyle: 'solid',
		borderWidth: token('border.width.selected', '2px'),
		color: 'inherit',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: 'inherit',
		fontStyle: 'normal',
		fontWeight: token('font.weight.regular'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1',
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		outline: 'none',
		paddingBlockEnd: token('space.050'),
		paddingBlockStart: token('space.050'),
		paddingInlineEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		textAlign: 'left',
		textDecoration: 'none',
	},
	rootDisabled: {
		cursor: 'not-allowed',
		opacity: token('opacity.disabled', '0.5'),
		pointerEvents: 'none',
	},
	rootInteractive: {
		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered', '#EBECF0'),
			cursor: 'pointer',
			textDecoration: 'none',
		},
		'&:focus': {
			borderColor: token('color.border.focused', '#2684FF'),
			outline: 'none',
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed', '#DEEBFF'),
		},
	},
	avatarItem: {
		minWidth: 0,
		maxWidth: '100%',
		flex: '1 1 100%',
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '1.4',
		paddingInlineStart: token('space.100'),
	},
	baseText: {
		display: 'block',
		color: token('color.text'),
	},
	truncation: {
		overflowX: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	secondaryTextLegacy: {
		color: token('color.text.subtlest'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		fontSize: '0.85em',
	},
});

export interface AvatarItemProps {
	/**
	 * Used to provide better content to screen readers when using presence/status. Rather
	 * than a screen reader speaking "online, approved, John Smith", passing in an label
	 * allows a custom message like "John Smith (approved and online)".
	 */
	label?: string;
	/**
	 * Slot to place an avatar element. Use @atlaskit/avatar.
	 */
	avatar: ReactNode;
	/**
	 * Change background color.
	 */
	backgroundColor?: string;
	/**
	 * URL for avatars being used as a link.
	 */
	href?: string;
	/**
	 * Disable the item from being interactive.
	 */
	isDisabled?: boolean;
	/**
	 * Handler to be called on click.
	 */
	onClick?: AvatarClickEventHandler;
	/**
	 * PrimaryText text.
	 */
	primaryText?: ReactNode;
	/**
	 * SecondaryText text.
	 */
	secondaryText?: ReactNode;
	/**
	 * Pass target down to the anchor, if href is provided.
	 */
	target?: '_blank' | '_self' | '_top' | '_parent';
	/**
	 * By default, overflowing text is truncated if it exceeds the container width. Use this prop to disable this.
	 */
	isTruncationDisabled?: boolean;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
}

/**
 * __Avatar item__
 *
 * An avatar item is a wrapper that goes around an avatar when it's displayed alongside text, such as a name or status.
 *
 * - [Examples](https://atlassian.design/components/avatar/avatar-item/examples)
 * - [Code](https://atlassian.design/components/avatar/avatar-item/code)
 */
const AvatarItem: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<AvatarItemProps> & React.RefAttributes<HTMLElement>
> = forwardRef<HTMLElement, AvatarItemProps>(
	(
		{
			avatar,
			backgroundColor = 'transparent',
			isTruncationDisabled,
			href,
			isDisabled,
			onClick,
			primaryText,
			secondaryText,
			target,
			testId,
			label,
		},
		ref,
	) => {
		const Container = getCustomElement(isDisabled, href, onClick);
		const isInteractive = Boolean(onClick || href);

		return (
			<Container
				css={[
					styles.root,
					isInteractive && styles.rootInteractive,
					isDisabled && styles.rootDisabled,
				]}
				style={{ [bgColorCssVar]: backgroundColor } as CSSProperties}
				ref={ref as React.Ref<HTMLAnchorElement & HTMLButtonElement & HTMLSpanElement>}
				aria-label={isInteractive ? label : undefined}
				onClick={onClick}
				disabled={isDisabled}
				data-testid={testId ? `${testId}--itemInner` : undefined}
				type={Container === 'button' ? 'button' : undefined}
				{...(href && {
					href,
					target,
					rel: target === '_blank' ? 'noopener noreferrer' : undefined,
				})}
			>
				{avatar}
				<div css={styles.avatarItem}>
					{fg('platform.design-system-team.avatar-item-font-size_830x6') ? (
						<Fragment>
							<Text maxLines={isTruncationDisabled ? undefined : 1}>{primaryText}</Text>
							<Text
								color="color.text.subtlest"
								maxLines={isTruncationDisabled! ? undefined : 1}
								size="small"
							>
								{secondaryText}
							</Text>
						</Fragment>
					) : (
						<Fragment>
							<span css={[styles.baseText, !isTruncationDisabled && styles.truncation]}>
								{primaryText}
							</span>
							<span
								css={[
									styles.baseText,
									styles.secondaryTextLegacy,
									!isTruncationDisabled && styles.truncation,
								]}
							>
								{secondaryText}
							</span>
						</Fragment>
					)}
				</div>
			</Container>
		);
	},
);

AvatarItem.displayName = 'AvatarItem';

export default AvatarItem;
