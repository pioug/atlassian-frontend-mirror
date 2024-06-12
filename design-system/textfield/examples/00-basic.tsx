import React from 'react';

import { Label } from '@atlaskit/form';

import Textfield from '../src';

export default function BasicExample() {
	return (
		<div>
			<Label htmlFor="basic">Basic text field</Label>
			<Textfield name="basic" id="basic" />
		</div>
	);
}
