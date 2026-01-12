import React from 'react';

import { Label } from '@atlaskit/form';
import TextArea from '@atlaskit/textarea';

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
