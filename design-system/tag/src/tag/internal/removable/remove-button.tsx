/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FocusEventHandler, type KeyboardEventHandler, type MouseEventHandler } from 'react';

import { cssMap, cx, jsx } from '@atlaskit/css';
import CrossIcon from '@atlaskit/icon/utility/migration/cross--editor-close';
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
		borderRadius: token('border.radius.050'),
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

// To be removed with platform-component-visual-refresh (BLU-2992)
const removeButtonStylesOld = cssMap({
	root: {
		display: 'flex',
		height: '16px',
		marginInlineStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginBlockEnd: token('space.0'),
		paddingInline: token('space.0'),
		paddingBlock: token('space.0'),
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
		appearance: 'none',
		backgroundColor: token('color.background.neutral.subtle'),
		border: 'none',
		// Once legacy theming is dropped, this can be changed to 'border.radius'
		// NOTE: We are using `as var(--ds-…)` to hack this into our `@atlaskit/css` interface.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		borderRadius: 'var(--ds-br)' as 'var(--ds-border-radius)',
		// Once legacy theming is dropped, this can be changed to 'inherit'
		// NOTE: We are using `as var(--ds-…)` to hack this into our `@atlaskit/css` interface.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: 'var(--ds-rb)' as 'var(--ds-text)',
		cursor: 'pointer',
		pointerEvents: 'auto',

		'&:focus-visible': {
			outlineOffset: token('space.0'),
		},

		'&:hover': {
			// Once legacy theming is dropped, this can be changed to 'color.text.default'
			// NOTE: We are using `as var(--ds-…)` to hack this into our `@atlaskit/css` interface.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			color: 'var(--ds-rbh)' as 'var(--ds-text)',
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
				// TODO: When cleaning up all these feature gates, they should just be converged into a single `styles` object.
				fg('platform-component-visual-refresh') && removeButtonStyles.root,
				!fg('platform-component-visual-refresh') && removeButtonStylesOld.root,
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
			<CrossIcon color="currentColor" label="" LEGACY_size="small" />
		</Pressable>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RemoveButton;
