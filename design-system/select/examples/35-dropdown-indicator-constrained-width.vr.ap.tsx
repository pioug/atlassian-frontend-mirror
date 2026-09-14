/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Label } from '@atlaskit/form/label/default';
import Select from '@atlaskit/select/default';
import type { StylesConfig } from '@atlaskit/select/types';

interface CityOption {
	readonly label: string;
	readonly value: string;
}

// Reproduces the consumer layout from JPO-42328 (Jira Plans' hierarchy filter):
// the select control is given a fixed width and an ancestor ships a global
// `button { min-width: 149px }` rule. Before the fix, the voice-control gate
// turned the dropdown indicator into a <button> that matched this rule and got
// stretched to 149px, pushing the chevron into the middle of the control.
// With the fix the chevron must stay pinned to the right regardless of the gate.
const controlWidthStyles: StylesConfig<CityOption, false> = {
	control: (base) => ({
		...base,
		width: 283,
	}),
};

const styles = cssMap({
	// A leaky, high-specificity consumer selector that targets every descendant
	// <button> — mirroring how the Jira Plans hierarchy filter styles its select
	// trigger. The dropdown-indicator fix must be resilient to this.
	buttonMinWidth: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'& button': {
			minWidth: '149px',
		},
	},
});

const ConstrainedWidthExample = (): React.JSX.Element => (
	<div css={styles.buttonMinWidth}>
		<Label htmlFor="constrained-width-select">From</Label>
		<Select<CityOption>
			inputId="constrained-width-select"
			testId="react-select"
			spacing="compact"
			value={{ label: 'Adelaide', value: 'adelaide' }}
			options={[
				{ label: 'Adelaide', value: 'adelaide' },
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Darwin', value: 'darwin' },
			]}
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides
			styles={controlWidthStyles}
		/>
	</div>
);

export default ConstrainedWidthExample;
