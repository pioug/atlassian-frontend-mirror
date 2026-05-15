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

export interface LabelProps {
	id?: string;
	htmlFor: string;
	children: ReactNode;
	testId?: string;
}
/**
 * __Label__
 *
 * A label represents a caption for an item in a user interface.
 *
 * It's recommended that a label has a `space.050` spacing above its associated
 * control element.
 */
export const Label: ({ children, htmlFor, id, testId }: LabelProps) => JSX.Element = ({
	children,
	htmlFor,
	id,
	testId,
}: LabelProps) => (
	<label css={fieldsetLabelStyles} id={id} htmlFor={htmlFor} data-testid={testId}>
		{children}
	</label>
);
