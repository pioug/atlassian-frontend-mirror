/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx, cssMap, cx } from '@compiled/react';
import { FlashAnimation } from './FlashAnimation';
import { type ReactionProps } from './Reaction';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { Pressable } from '@atlaskit/primitives/compiled';

const styles = cssMap({
	reactionButton: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		minWidth: '36px',
		height: '24px',
		backgroundColor: token('color.background.neutral.subtle'),
		borderWidth: token('border.width'),
		borderStyle: 'solid',
		borderColor: token('color.border'),
		borderRadius: token('border.radius.circle'),
		color: token('color.text.subtle'),
		marginBlockStart: token('space.050'),
		marginInlineEnd: token('space.050'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
		overflow: 'hidden',

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},

	reactionStylesRefresh: {
		borderRadius: token('border.radius'),
	},

	reacted: {
		backgroundColor: token('color.background.selected'),
		borderColor: token('color.border.selected'),
		'&:hover': {
			backgroundColor: token('color.background.selected.hovered'),
		},
		'&:active': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},

	opaqueBackground: {
		backgroundColor: token('elevation.surface'),
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
		'&:active': {
			backgroundColor: token('elevation.surface.pressed'),
		},
	},

	compactButton: {
		height: '20px',
		alignItems: 'center',
		marginTop: token('space.075'),
	},

	borderless: {
		borderStyle: 'none',
	},
});

/**
 * Default styling px height for an emoji reaction
 */
const akHeight = 24;

const flashHeight = akHeight - 2; // height without the 1px border

const flashStyle = css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	borderRadius: token('border.radius.050'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	height: `${flashHeight}px`,
});

const flashStyleOld = css({
	display: 'flex',
	flexDirection: 'row',
	alignItems: 'center',
	borderRadius: '10px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values
	height: `${flashHeight}px`,
});

interface ReactionButtonProps extends Pick<ReactionProps, 'flash'> {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	className?: string;
	ariaLabel: string;
	ariaPressed?: boolean;
	onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
	dataAttributes?: { [key: string]: string };
	testId?: string;
	children?: React.ReactNode;
	showSubtleStyle?: boolean;
	showOpaqueBackground?: boolean;
	useCompactStyles?: boolean;
	reacted?: boolean;
}
export const ReactionButton = ({
	onClick,
	flash = false,
	showSubtleStyle,
	showOpaqueBackground,
	useCompactStyles,
	reacted,
	ariaLabel,
	ariaPressed,
	onMouseEnter,
	onMouseLeave,
	onFocus,
	children,
	dataAttributes = {},
	testId,
}: ReactionButtonProps) => {
	return (
		<Pressable
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onFocus={onFocus}
			aria-label={ariaLabel}
			aria-pressed={ariaPressed}
			testId={testId}
			xcss={cx(
				styles.reactionButton,
				useCompactStyles && styles.compactButton,
				reacted && styles.reacted,
				!reacted && showSubtleStyle && styles.borderless,
				!reacted && showOpaqueBackground && styles.opaqueBackground,
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				fg('platform-component-visual-refresh') && styles.reactionStylesRefresh,
			)}
			{...dataAttributes}
		>
			<FlashAnimation
				flash={flash}
				// eslint-disable-next-line @atlaskit/platform/ensure-feature-flag-prefix
				css={[fg('platform-component-visual-refresh') ? flashStyle : flashStyleOld]}
			>
				{children}
			</FlashAnimation>
		</Pressable>
	);
};
