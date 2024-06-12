/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import {
	createElement,
	forwardRef,
	Fragment,
	type MouseEventHandler,
	type ReactNode,
	type Ref,
} from 'react';

import { ClassNames, css, jsx } from '@emotion/react';
import { type CSSInterpolation } from '@emotion/serialize';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Text } from '@atlaskit/primitives';
import { B200, B50, N30 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { BORDER_WIDTH } from './constants';
import { type AvatarClickEventHandler } from './types';
import { getButtonProps, getCustomElement, getLinkProps } from './utilities';

const avatarItemStyles = css({
	minWidth: 0,
	maxWidth: '100%',
	flex: '1 1 100%',
	lineHeight: '1.4',
	paddingInlineStart: token('space.100', '8px'),
});

const secondaryTextOldStyles = css({
	color: token('color.text.subtlest'),
	fontSize: '0.85em',
});

const baseTextStyles = css({
	display: 'block',
	color: token('color.text'),
});

const truncationStyles = css({
	overflowX: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export interface CustomAvatarItemProps {
	testId?: string;
	onClick?: MouseEventHandler;
	className?: string;
	href?: string;
	children: ReactNode;
	ref: Ref<HTMLElement>;
	/**
	 * This is used in render props so is okay to be defined.
	 * eslint-disable-next-line consistent-props-definitions
	 */
	'aria-label'?: string;
	'aria-disabled'?: boolean | 'false' | 'true' | undefined;
}

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
	 * Use a custom component instead of the default span.
	 */
	children?: (props: CustomAvatarItemProps) => ReactNode;
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

const getStyles = (
	css: (template: TemplateStringsArray, ...args: Array<CSSInterpolation>) => string,
	{
		backgroundColor,
		isInteractive,
		isDisabled,
	}: {
		backgroundColor: string;
		isInteractive: boolean;
		isDisabled?: boolean;
	},
) =>
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @repo/internal/react/no-css-string-literals
	css`
		align-items: center;
		background-color: ${backgroundColor};
		border-radius: ${borderRadius()}px;
		border: ${BORDER_WIDTH}px solid transparent;
		box-sizing: border-box;
		color: inherit;
		display: flex;
		font-size: inherit;
		font-style: normal;
		font-weight: normal;
		line-height: 1;
		outline: none;
		margin: ${token('space.0', '0px')};
		padding: ${token('space.050', '4px')};
		text-align: left;
		text-decoration: none;
		width: 100%;

		${isInteractive &&
		`
        :hover {
          background-color: ${token('color.background.neutral.subtle.hovered', N30)};
          cursor: pointer;
          text-decoration: none;
        }

        :focus {
          outline: none;
          border-color: ${token('color.border.focused', B200)};
        }

        :active {
          background-color: ${token('color.background.neutral.subtle.pressed', B50)};
        }
      `}

		${isDisabled &&
		`
        cursor: not-allowed;
        opacity: ${token('opacity.disabled', '0.5')};
        pointer-events: none;
      `}
	`;

/**
 * __Avatar item__
 *
 * An avatar item is a wrapper that goes around an avatar when it's displayed alongside text, such as a name or status.
 *
 * - [Examples](https://atlassian.design/components/avatar/avatar-item/examples)
 * - [Code](https://atlassian.design/components/avatar/avatar-item/code)
 */
const AvatarItem = forwardRef<HTMLElement, AvatarItemProps>(
	(
		{
			avatar,
			backgroundColor = 'transparent',
			children,
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
		const getTestId = (testId?: string, children?: AvatarItemProps['children']) =>
			!children ? { 'data-testid': `${testId}--itemInner` } : { testId: `${testId}--itemInner` };

		const componentProps = () => {
			if (isDisabled) {
				return { disabled: true };
			}

			// return only relevant props for either anchor or button elements
			return {
				...(href && getLinkProps(href, target)),
				...(onClick && !href ? getButtonProps(onClick) : { onClick }),
			};
		};

		return (
			<ClassNames>
				{({ css }) => {
					const props: CustomAvatarItemProps = {
						ref,
						className: getStyles(css, {
							backgroundColor,
							isInteractive: Boolean(onClick || href),
							isDisabled,
						}),
						...componentProps(),
						...(testId && getTestId(testId, children)),
						...((onClick || href) && { 'aria-label': label }),
						children: (
							<Fragment>
								{avatar}
								<div css={avatarItemStyles}>
									{getBooleanFF('platform.design-system-team.avatar-item-font-size_830x6') ? (
										<Fragment>
											<Text maxLines={isTruncationDisabled ? undefined : 1}>{primaryText}</Text>
											<Text
												color="color.text.subtlest"
												maxLines={isTruncationDisabled! ? undefined : 1}
												size="UNSAFE_small"
											>
												{secondaryText}
											</Text>
										</Fragment>
									) : (
										<Fragment>
											<span css={[baseTextStyles, !isTruncationDisabled && truncationStyles]}>
												{primaryText}
											</span>
											<span
												css={[
													baseTextStyles,
													secondaryTextOldStyles,
													!isTruncationDisabled && truncationStyles,
												]}
											>
												{secondaryText}
											</span>
										</Fragment>
									)}
								</div>
							</Fragment>
						),
					};

					return children
						? children(props)
						: createElement(getCustomElement(isDisabled, href, onClick), props);
				}}
			</ClassNames>
		);
	},
);

AvatarItem.displayName = 'AvatarItem';

export default AvatarItem;
