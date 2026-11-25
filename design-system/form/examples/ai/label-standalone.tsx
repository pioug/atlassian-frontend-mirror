import React, { useId } from 'react';

import { Label } from '@atlaskit/form/label/default';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import TextField from '@atlaskit/textfield/text-field';

export default function LabelStandaloneExample(): React.JSX.Element {
	const id = useId();

	return (
		<Flex direction="column">
			<Label htmlFor={id}>Work email</Label>
			<TextField id={id} name="email" type="email" autoComplete="email" />
		</Flex>
	);
}
