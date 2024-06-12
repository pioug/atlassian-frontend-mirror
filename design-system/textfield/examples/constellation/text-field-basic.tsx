import React from 'react';

import { Label } from '@atlaskit/form';

import Textfield from '../../src';

export default function TextFieldBasicExample() {
	return (
		<>
			<Label htmlFor="basic-textfield">Field label</Label>
			<Textfield name="basic" id="basic-textfield" />
		</>
	);
}
