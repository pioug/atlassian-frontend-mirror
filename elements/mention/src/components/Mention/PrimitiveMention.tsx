/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import {
	forwardRef,
	type ForwardRefExoticComponent,
	type HTMLAttributes,
	type RefAttributes,
} from 'react';

/* eslint-disable @atlaskit/design-system/no-html-button */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import type { MentionType } from '../../types';
import { mentionStyle } from './mention-style';
export interface PrimitiveMentionProps extends HTMLAttributes<HTMLSpanElement> {
	isAvatarVisible?: boolean;
	mentionType: MentionType;
}

const getStyle = (
	{ mentionType }: PrimitiveMentionProps,
	property: 'background' | 'borderColor' | 'text' | 'hoveredBackground' | 'pressedBackground',
) => mentionStyle[mentionType][property];

const PrimitiveMention: ForwardRefExoticComponent<
	PrimitiveMentionProps & RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, PrimitiveMentionProps>(
	({ isAvatarVisible = false, mentionType, ...other }, ref) => {
		return (
			<span
				ref={ref}
				data-avatar-visible={isAvatarVisible || undefined}
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
					&[data-avatar-visible='true'] {
						padding: 1px 0.3em 1px 0.23em;
					}
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
