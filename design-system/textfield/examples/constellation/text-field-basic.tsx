import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import Textfield from '@atlaskit/textfield/text-field';

export default function TextFieldBasicExample(): React.JSX.Element {
	return (
		<>
			<Label htmlFor="basic-textfield">Field label</Label>
			<Textfield name="basic" id="basic-textfield" />
		</>
	);
}
