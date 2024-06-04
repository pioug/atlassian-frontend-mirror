/** @jsx jsx */
import { type FC, type ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N200 } from '@atlaskit/theme/colors';
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
	font: token('font.body.UNSAFE_small'),
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.0'),
});

const oldFieldsetLabelStyles = css({
	color: token('color.text.subtle', N200),
	fontWeight: token('font.weight.semibold'),
});

const newFieldsetLabelStyles = css({
	color: token('color.text.subtle'),
	fontWeight: token('font.weight.bold'),
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
	<label
		css={[
			fieldsetLabelStyles,
			getBooleanFF('platform.design-system-team.form-label-typography-updates')
				? newFieldsetLabelStyles
				: oldFieldsetLabelStyles,
		]}
		id={id}
		htmlFor={htmlFor}
		data-testid={testId}
	>
		{children}
	</label>
);

/**
 * __Legend__
 *
 * A Legend represents a caption for a fieldset in a user interface.
 */
export const Legend: FC<LegendProps> = ({ children }) => {
	return (
		<legend
			css={[
				fieldsetLabelStyles,
				getBooleanFF('platform.design-system-team.form-label-typography-updates')
					? newFieldsetLabelStyles
					: oldFieldsetLabelStyles,
			]}
		>
			{children}
		</legend>
	);
};

export default Label;
