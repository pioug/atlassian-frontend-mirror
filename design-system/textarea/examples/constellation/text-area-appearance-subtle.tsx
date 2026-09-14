import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import TextArea from '@atlaskit/textarea/text-area';

export default function TextAreaAppearanceSubtle(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="appearance-subtle">Subtle appearance</Label>
			<TextArea
				appearance="subtle"
				id="appearance-subtle"
				name="appearance-subtle"
				placeholder=""
			/>
		</>
	);
}
