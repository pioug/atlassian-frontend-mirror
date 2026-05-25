/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the experiment has shipped.
 */
import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

const inputCompiledStyles = cssMap({
	root: {
		backgroundColor: token('color.background.input'),
		border: `1px solid ${token('color.border.input')}`,
		borderRadius: token('radius.small', '3px'),
		boxSizing: 'border-box',
		height: '40px',
		paddingLeft: token('space.250'),
		paddingTop: token('space.150'),
		paddingBottom: token('space.150'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography -- Ignored via go/DSP-18766
		fontSize: '0.875rem',
		width: '100%',
		fontWeight: token('font.weight.regular'),
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		lineHeight: 1.42857142857143,
		// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
		letterSpacing: '-0.005em',
		color: token('color.text.subtlest'),
		'&:hover': {
			backgroundColor: token('color.background.input.hovered'),
			borderColor: token('color.border.input'),
			cursor: 'text',
		},
	},
});

export const ChromeCollapsedCompiled: React.ForwardRefExoticComponent<
	InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	// eslint-disable-next-line react/jsx-props-no-spreading
	({ ...rest }, ref) => <input ref={ref} css={inputCompiledStyles.root} {...rest} />,
);
