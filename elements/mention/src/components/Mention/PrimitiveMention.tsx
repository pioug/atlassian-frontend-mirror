/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';
import { token } from '@atlaskit/tokens';
import {
	forwardRef,
	type ForwardRefExoticComponent,
	type HTMLAttributes,
	type RefAttributes,
} from 'react';

import { mentionStyle } from './mention-style';
import type { MentionType } from '../../types';

export interface PrimitiveMentionProps extends HTMLAttributes<HTMLSpanElement> {
	mentionType: MentionType;
}
const getStyle = (
	{ mentionType }: PrimitiveMentionProps,
	property: 'background' | 'borderColor' | 'text' | 'hoveredBackground' | 'pressedBackground',
) => mentionStyle[mentionType][property];

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
