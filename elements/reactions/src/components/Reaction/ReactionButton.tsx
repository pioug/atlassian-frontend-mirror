/** @jsx jsx */
import React from 'react';
import { Pressable, type XCSS, xcss } from '@atlaskit/primitives';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { FlashAnimation } from '../FlashAnimation';
import { type ReactionProps } from './Reaction';
import { flashStyle } from './styles';

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

interface ReactionButtonProps extends Pick<ReactionProps, 'flash'> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
	additionalStyles?: Array<XCSS>;
	ariaLabel: string;
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
			testId={testId}
			xcss={[reactionStyles, ...additionalStyles]}
			{...dataAttributes}
		>
			{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766 */}
			<FlashAnimation flash={flash} css={flashStyle}>
				{children}
			</FlashAnimation>
		</Pressable>
	);
};
