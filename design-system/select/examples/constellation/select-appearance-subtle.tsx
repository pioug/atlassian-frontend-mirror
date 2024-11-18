import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

export default function SelectAppearanceSubtle() {
	return (
		<>
			<Label htmlFor="subtle-appearance-example">Favourite fruit</Label>
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
