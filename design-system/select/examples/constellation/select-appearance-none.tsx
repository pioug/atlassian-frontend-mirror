import React from 'react';

import { Label } from '@atlaskit/form';
import Select from '@atlaskit/select';

export default function SelectAppearanceNone(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="none-appearance-example">Favorite fruit</Label>
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
