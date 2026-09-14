import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Textfield from '@atlaskit/textfield/text-field';

export default function BasicExample(): React.JSX.Element {
	return (
		<div>
			<Label htmlFor="basic">Basic text field</Label>
			<Textfield name="basic" id="basic" />
		</div>
	);
}
