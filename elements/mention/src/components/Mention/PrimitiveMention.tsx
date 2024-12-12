/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { B400, N500, N30A, N20 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { MentionType } from '../../types';
import { forwardRef, type HTMLAttributes } from 'react';

export interface PrimitiveMentionProps extends HTMLAttributes<HTMLSpanElement> {
	mentionType: MentionType;
}

const mentionStyle = {
	[MentionType.SELF]: {
		background: token('color.background.brand.bold', B400),
		borderColor: 'transparent',
		text: token('color.text.inverse', N20),
		hoveredBackground: token('color.background.brand.bold.hovered', B400),
		pressedBackground: token('color.background.brand.bold.pressed', B400),
	},
	[MentionType.RESTRICTED]: {
		background: 'transparent',
		borderColor: token('color.border.bold', N500),
		text: token('color.text', N500),
		hoveredBackground: 'transparent',
		pressedBackground: 'transparent',
	},
	[MentionType.DEFAULT]: {
		background: token('color.background.neutral', N30A),
		borderColor: 'transparent',
		text: token('color.text.subtle', N500),
		hoveredBackground: token('color.background.neutral.hovered', N30A),
		pressedBackground: token('color.background.neutral.pressed', N30A),
	},
} as const;

const getStyle = (
	{ mentionType }: PrimitiveMentionProps,
	property: 'background' | 'borderColor' | 'text' | 'hoveredBackground' | 'pressedBackground',
) => {
	const obj = mentionStyle[mentionType][property];

	return typeof obj === 'string' ? obj : obj;
};

const PrimitiveMention = forwardRef<HTMLSpanElement, PrimitiveMentionProps>(
	({ mentionType, ...other }, ref) => {
		return (
			<span
				ref={ref}
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/design-system/no-css-tagged-template-expression, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				css={css`
					display: inline;
					border: 1px solid ${getStyle({ mentionType }, 'borderColor')};
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
	},
);

export default PrimitiveMention;
