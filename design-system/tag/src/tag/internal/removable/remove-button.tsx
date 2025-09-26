/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import CloseIcon from '@atlaskit/icon/core/migration/cross--editor-close';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

type RemoveButtonProps = {
	'aria-label'?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	onFocus?: FocusEventHandler<HTMLButtonElement>;
	onBlur?: FocusEventHandler<HTMLButtonElement>;
	onKeyPress?: KeyboardEventHandler<HTMLButtonElement>;
	onMouseOver?: MouseEventHandler<HTMLButtonElement>;
	onMouseOut?: MouseEventHandler<HTMLButtonElement>;
	testId?: string;
};

const removeButtonStyles = cssMap({
	root: {
		display: 'flex',
		height: '16px',
		width: '16px',
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
			outlineOffset: token('space.negative.025'),
		},

		'&:hover': {
			backgroundColor: token('color.background.neutral.subtle.hovered'),
		},

		'&:active': {
			backgroundColor: token('color.background.neutral.subtle.pressed'),
		},
	},
});

const removeButtonStylesOldIcon = cssMap({
	root: {
		insetInlineEnd: token('space.0'),
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
	testId,
}: RemoveButtonProps) => {
	return (
		<Pressable
			xcss={cx(
				removeButtonStyles.root,
				removeButtonStylesOldIcon.root,
				fg('platform-visual-refresh-icons') && removeButtonStylesNewIcon.root,
			)}
			aria-label={ariaLabel}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyPress={onKeyPress}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			testId={testId}
		>
			<CloseIcon color="currentColor" label="" LEGACY_size="small" size="small" />
		</Pressable>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RemoveButton;
