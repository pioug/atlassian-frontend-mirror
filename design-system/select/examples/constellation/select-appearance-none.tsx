import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

export default function SelectAppearanceNone() {
	return (
		<>
			<Label htmlFor="none-appearance-example">Favourite fruit</Label>
			<Select
				inputId="none-appearance-example"
				appearance="none"
				options={[
					{ label: 'Apple', value: 'a' },
					{ label: 'Banana', value: 'b' },
				]}
			/>
		</>
	);
}
