import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

export default function SelectAppearanceDefault(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="default-appearance-example">Favorite fruit</Label>
			<Select
				inputId="default-appearance-example"
				appearance="default"
				options={[
					{ label: 'Apple', value: 'a' },
					{ label: 'Banana', value: 'b' },
				]}
			/>
		</>
	);
}
