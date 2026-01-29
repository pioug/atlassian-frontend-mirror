/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import CloseIcon from '@atlaskit/icon/core/cross';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export type RemoveButtonProps = {
	'aria-label'?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	onFocus?: FocusEventHandler<HTMLButtonElement>;
	onBlur?: FocusEventHandler<HTMLButtonElement>;
	onKeyPress?: KeyboardEventHandler<HTMLButtonElement>;
	onMouseOver?: MouseEventHandler<HTMLButtonElement>;
	onMouseOut?: MouseEventHandler<HTMLButtonElement>;
	onMouseDown?: MouseEventHandler<HTMLButtonElement>;
	onMouseUp?: MouseEventHandler<HTMLButtonElement>;
	onMouseEnter?: MouseEventHandler<HTMLButtonElement>;
	onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
	testId?: string;
	shape?: 'default' | 'circle';
};

const removeButtonStyles = cssMap({
	root: {
		display: 'flex',
		height: '1rem',
		width: '1rem',
		marginInline: token('space.0'),
		marginBlock: token('space.0'),
		paddingInline: token('space.0'),
		paddingBlock: token('space.0'),
		insetInlineEnd: token('space.0'),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		appearance: 'none',
		backgroundColor: token('color.background.neutral.subtle'),
		border: 'none',
		borderRadius: token('radius.xsmall'),
		color: token('color.text'),
		cursor: 'pointer',
		pointerEvents: 'auto',
		marginInlineStart: token('space.negative.025'),
		marginInlineEnd: token('space.negative.025'),

		'&:focus-visible': {
			outlineOffset: '0',
		},

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
	circle: {
		borderRadius: token('radius.full'),
		'&:focus-visible': {
			outlineOffset: 0,
		},
	},
});

const removeButtonStylesNewIcon = cssMap({
	root: {
		insetInlineEnd: token('space.025'),
	},
});

const RemoveButton = ({
	'aria-label': ariaLabel,
	onClick,
	onFocus,
	onBlur,
	onKeyPress,
	onMouseOver,
	onMouseOut,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	testId,
	shape = 'default',
}: RemoveButtonProps) => {
	return (
		<Pressable
			xcss={cx(
				removeButtonStyles.root,
				shape === 'circle' && removeButtonStyles.circle,
				removeButtonStylesNewIcon.root,
			)}
			aria-label={ariaLabel}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyPress={onKeyPress}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			testId={testId}
		>
			<CloseIcon color="currentColor" label="" size="small" />
		</Pressable>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RemoveButton;
