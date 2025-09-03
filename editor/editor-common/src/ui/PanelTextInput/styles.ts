// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, type SerializedStyles } from '@emotion/react';

import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

// Normal .className gets overridden by input[type=text] hence this hack to produce input.className
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const panelTextInput: SerializedStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'input&': {
		background: 'transparent',
		border: `1px solid ${token('color.border.input')}`,
		borderRadius: 3,
		boxSizing: 'content-box',
		color: token('color.text'),
		flexGrow: 1,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		fontSize: relativeFontSizeToBase16(13),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: '20px',
		padding: `${token('space.100', '8px')} ${token(
			'space.400',
			'32px',
		)} ${token('space.100', '8px')} ${token('space.100', '8px')}`,
		minWidth: '145px',
		/* Hides IE10+ built-in [x] clear input button */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&::-ms-clear': {
			display: 'none',
		},
		'&:focus': {
			outline: 'none',
			backgroundColor: token('color.background.input.pressed'),
			borderColor: token('color.border.focused'),
			boxShadow: `inset 0 0 0 ${token('border.width', '1px')} ${token('color.border.focused')}`,
		},
		'&::placeholder': {
			color: token('color.text.subtlest'),
		},
	},
});

export const panelTextInputWithCustomWidth = (width: number) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'input&': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			width: `${width}px`,
		},
	});
