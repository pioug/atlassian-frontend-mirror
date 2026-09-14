import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Select from '@atlaskit/select/default';

export default function SelectAppearanceSubtle(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="subtle-appearance-example">Favorite fruit</Label>
			<Select
				inputId="subtle-appearance-example"
				appearance="subtle"
				options={[
					{ label: 'Apple', value: 'a' },
					{ label: 'Banana', value: 'b' },
				]}
			/>
		</>
	);
}
