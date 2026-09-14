import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Textfield from '@atlaskit/textfield/text-field';

export default function MaxValueExample(): React.JSX.Element {
	return (
		<div>
			<Label htmlFor="max">Max length of 5</Label>
			<Textfield name="max" maxLength={5} id="max" />
		</div>
	);
}
