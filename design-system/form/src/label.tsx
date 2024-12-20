/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

export interface LabelProps {
	id?: string;
	htmlFor: string;
	children: ReactNode;
	testId?: string;
}

export interface LegendProps {
	children: ReactNode;
}

const fieldsetLabelStyles = css({
	display: 'inline-block',
	color: token('color.text.subtle'),
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.bold'),
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.0'),
});

/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `space.050` spacing above its associated
 * control element.
 */
export const Label: FC<LabelProps> = ({ children, htmlFor, id, testId }) => (
	<label css={fieldsetLabelStyles} id={id} htmlFor={htmlFor} data-testid={testId}>
		{children}
	</label>
);

/**
 * __Legend__
 *
 * A Legend represents a caption for a fieldset in a user interface.
 */
export const Legend: FC<LegendProps> = ({ children }) => {
	return <legend css={fieldsetLabelStyles}>{children}</legend>;
};

export default Label;
