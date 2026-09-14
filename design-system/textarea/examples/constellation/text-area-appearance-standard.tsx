import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import TextArea from '@atlaskit/textarea/text-area';

export default function TextAreaAppearanceStandard(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="standard-appearance">Standard appearance</Label>
			<TextArea
				appearance="standard"
				id="standard-appearance"
				name="standard-appearance"
				placeholder=""
			/>
		</>
	);
}
