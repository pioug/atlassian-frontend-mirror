import React from 'react';

import { Label } from '@atlaskit/form';
import { AtlassianIcon } from '@atlaskit/logo';
import Select, { type FormatOptionLabelMeta, type OptionType } from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

const formatOptionLabel = (option: OptionType, { context }: FormatOptionLabelMeta<OptionType>) => {
	if (context === 'menu') {
		return (
			<div
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					display: 'flex',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
					alignItems: 'center',
				}}
			>
				<AtlassianIcon size="small" />
				<span
					style={{
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						paddingLeft: token('space.100', '8px'),
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
						paddingBottom: 0,
					}}
				>
					{option.label}
				</span>
			</div>
		);
	}
	return option.label;
};
const ElementBeforeExample = (): React.JSX.Element => (
	<>
		<Label htmlFor="element-before-example">Which city do you live in?</Label>
		<Select
			inputId="element-before-example"
			formatOptionLabel={formatOptionLabel}
			options={[
				{ label: 'Adelaide', value: 'adelaide' },
				{ label: 'Brisbane', value: 'brisbane' },
				{ label: 'Canberra', value: 'canberra' },
				{ label: 'Darwin', value: 'darwin' },
				{ label: 'Hobart', value: 'hobart' },
				{ label: 'Melbourne', value: 'melbourne' },
				{ label: 'Perth', value: 'perth' },
				{ label: 'Sydney', value: 'sydney' },
			]}
		/>
	</>
);

export default ElementBeforeExample;
