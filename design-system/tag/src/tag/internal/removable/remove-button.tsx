import React, {
	type FocusEventHandler,
	type KeyboardEventHandler,
	type MouseEventHandler,
} from 'react';

import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
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
	margin: 'space.0',
	padding: 'space.0',
	position: 'absolute',
	insetInlineEnd: 'space.0',
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
			xcss={removeButtonStyles}
			aria-label={ariaLabel}
			onClick={onClick}
			onFocus={onFocus}
			onBlur={onBlur}
			onKeyPress={onKeyPress}
			onMouseOver={onMouseOver}
			onMouseOut={onMouseOut}
			testId={testId}
		>
			<EditorCloseIcon label="close tag" size="small" />
		</Pressable>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default RemoveButton;
