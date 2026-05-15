/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const fieldsetLabelStyles = css({
	display: 'inline-block',
	color: token('color.text.subtle'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.bold'),
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.0'),
});

export interface LegendProps {
	children: ReactNode;
}
/**
 * __Legend__
 *
 * A Legend represents a caption for a fieldset in a user interface.
 */
export const Legend: ({ children }: LegendProps) => JSX.Element = ({ children }: LegendProps) => {
	return <legend css={fieldsetLabelStyles}>{children}</legend>;
};
