/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { Pressable, type XCSS, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FlashAnimation } from '../FlashAnimation';
import { type ReactionProps } from './Reaction';
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
import { flashStyle, flashStyleOld } from './styles';
import { fg } from '@atlaskit/platform-feature-flags';

const reactionStyles = xcss({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'flex-start',
	minWidth: '36px',
	height: '24px',
	backgroundColor: 'color.background.neutral.subtle',
	borderWidth: 'border.width',
	borderStyle: 'solid',
	borderColor: 'color.border',
	borderRadius: 'border.radius.circle',
	color: 'color.text.subtle',
	marginBlockStart: 'space.050',
	marginInlineEnd: 'space.050',
	padding: 'space.0',
	overflow: 'hidden',

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},
	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

const reactionStylesRefresh = xcss({
	borderRadius: 'border.radius',
});

interface ReactionButtonProps extends Pick<ReactionProps, 'flash'> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
	additionalStyles?: Array<XCSS>;
	ariaLabel: string;
	ariaPressed?: boolean;
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	dataAttributes?: { [key: string]: string };
	testId?: string;
	children?: React.ReactNode;
}
export const ReactionButton = ({
	onClick,
	flash = false,
	additionalStyles = [],
	ariaLabel,
	ariaPressed,
	onMouseEnter,
	onFocus,
	children,
	dataAttributes = {},
	testId,
}: ReactionButtonProps) => {
	return (
		<Pressable
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onFocus={onFocus}
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			testId={testId}
			xcss={[
				reactionStyles,
				...additionalStyles,
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('platform-component-visual-refresh') && reactionStylesRefresh,
			]}
			{...dataAttributes}
		>
			<FlashAnimation
				flash={flash}
				/* eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */
				css={fg('platform-component-visual-refresh') ? flashStyle : flashStyleOld}
			>
				{children}
			</FlashAnimation>
		</Pressable>
	);
};
