/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { Legend } from './label';

interface FieldsetProps {
	/**
	 * Content to render in the fieldset.
	 */
	children: ReactNode;
	/**
	 * Label describing the contents of the fieldset.
	 */
	legend?: ReactNode;
}

const fieldSetStyles = css({
	marginBlockStart: token('space.100', '8px'),
});

/**
 * __Fieldset__
 *
 * A fieldset groups a number of fields together. For example, when multiple CheckboxFields share the same name,
 * a fieldset can be used to group them together. This makes the form more accessible.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 * - [Usage](https://atlaskit.atlassian.com/packages/design-system/form/docs/fields)
 */
const Fieldset = ({ children, legend }: FieldsetProps) => {
	return (
		<fieldset css={fieldSetStyles}>
			{legend && <Legend>{legend}</Legend>}
			{children}
		</fieldset>
	);
};

export default Fieldset;
