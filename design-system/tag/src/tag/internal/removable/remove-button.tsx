import React, {
	type FocusEventHandler,
	type KeyboardEventHandler,
	type MouseEventHandler,
} from 'react';

import CrossIcon from '@atlaskit/icon/utility/migration/cross--editor-close';
import { fg } from '@atlaskit/platform-feature-flags';
import { Pressable, xcss } from '@atlaskit/primitives';

import { cssVar } from '../../../constants';

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

const removeButtonStyles = xcss({
	display: 'flex',
	height: '16px',
	width: '16px',
	margin: 'space.0',
	padding: 'space.0',
	insetInlineEnd: 'space.0',
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'center',
	appearance: 'none',
	backgroundColor: 'color.background.neutral.subtle',
	border: 'none',
	borderRadius: 'border.radius.050',
	color: 'color.text',
	cursor: 'pointer',
	pointerEvents: 'auto',
	marginInlineStart: 'space.negative.025',
	marginInlineEnd: 'space.negative.025',

	':focus-visible': {
		outlineOffset: 'space.negative.025',
	},

	':hover': {
		backgroundColor: 'color.background.neutral.subtle.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.subtle.pressed',
	},
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const removeButtonStylesOld = xcss({
	display: 'flex',
	height: '16px',
	margin: 'space.0',
	padding: 'space.0',
	position: 'absolute',
	alignItems: 'center',
	justifyContent: 'center',
	alignSelf: 'center',
	appearance: 'none',
	backgroundColor: 'color.background.neutral.subtle',
	border: 'none',
	// Once legacy theming is dropped, this can be changed to 'border.radius'
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `var(${cssVar.borderRadius})`,
	// Once legacy theming is dropped, this can be changed to 'inherit'
	// @ts-expect-error
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `var(${cssVar.color.removeButton.default})`,
	cursor: 'pointer',
	pointerEvents: 'auto',

	':focus-visible': {
		outlineOffset: 'space.0',
	},

	':hover': {
		// Once legacy theming is dropped, this can be changed to 'cssVar.color.text.default'
		// @ts-expect-error
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: `var(${cssVar.color.removeButton.hover})`,
	},
});

const removeButtonStylesOldIcon = xcss({
	insetInlineEnd: 'space.0',
});
const removeButtonStylesNewIcon = xcss({
	insetInlineEnd: 'space.025',
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
			xcss={[
				fg('platform-component-visual-refresh') ? removeButtonStyles : removeButtonStylesOld,
				fg('platform-visual-refresh-icons') ? removeButtonStylesNewIcon : removeButtonStylesOldIcon,
			]}
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
