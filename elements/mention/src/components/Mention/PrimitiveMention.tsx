/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import { MentionType } from '../../types';
import {
	forwardRef,
	type ForwardRefExoticComponent,
	type HTMLAttributes,
	type RefAttributes,
} from 'react';

export interface PrimitiveMentionProps extends HTMLAttributes<HTMLSpanElement> {
	mentionType: MentionType;
}

const mentionStyle = {
	[MentionType.SELF]: {
		background: token('color.background.brand.bold'),
		borderColor: 'transparent',
		text: token('color.text.inverse'),
		hoveredBackground: token('color.background.brand.bold.hovered'),
		pressedBackground: token('color.background.brand.bold.pressed'),
	},
	[MentionType.RESTRICTED]: {
		background: 'transparent',
		borderColor: token('color.border.bold'),
		text: token('color.text'),
		hoveredBackground: 'transparent',
		pressedBackground: 'transparent',
	},
	[MentionType.DEFAULT]: {
		background: token('color.background.neutral'),
		borderColor: 'transparent',
		text: token('color.text.subtle'),
		hoveredBackground: token('color.background.neutral.hovered'),
		pressedBackground: token('color.background.neutral.pressed'),
	},
} as const;

const getStyle = (
	{ mentionType }: PrimitiveMentionProps,
	property: 'background' | 'borderColor' | 'text' | 'hoveredBackground' | 'pressedBackground',
) => {
	const obj = mentionStyle[mentionType][property];

	return typeof obj === 'string' ? obj : obj;
};

const PrimitiveMention: ForwardRefExoticComponent<
	PrimitiveMentionProps & RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, PrimitiveMentionProps>(({ mentionType, ...other }, ref) => {
	return (
		<span
			ref={ref}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={css`
				display: inline;
				border: ${token('border.width')} solid ${getStyle({ mentionType }, 'borderColor')};
				background: ${getStyle({ mentionType }, 'background')};
				color: ${getStyle({ mentionType }, 'text')};
				border-radius: 20px;
				cursor: pointer;
				padding: 0 0.3em 2px 0.23em;
				line-height: 1.714;
				font-size: 1em;
				font-weight: ${token('font.weight.regular')};
				word-break: break-word;
				&:hover {
					background: ${getStyle({ mentionType }, 'hoveredBackground')};
				}
				&:active {
					background: ${getStyle({ mentionType }, 'pressedBackground')};
				}
			`}
			{...other}
		/>
	);
});

export default PrimitiveMention;
