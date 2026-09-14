import React from 'react';

import Button from '@atlaskit/button/default/button';
import { Label } from '@atlaskit/form/label/default';
import Textfield from '@atlaskit/textfield/text-field';

export default function ForwardRefExample(): React.JSX.Element {
	let input: HTMLInputElement | null = null;

	const handleRef = (ref: HTMLInputElement | null) => {
		input = ref;
	};

	const handleFocus = () => {
		if (input) {
			input.focus();
		}
	};

	return (
		<div>
			<Label htmlFor="textfield">Text Input</Label>
			<Textfield id="textfield" ref={handleRef} />
			<p>
				<Button appearance="primary" onClick={handleFocus}>
					Focus TextField
				</Button>
			</p>
		</div>
	);
}
