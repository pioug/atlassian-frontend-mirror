import React from 'react';

import { Label } from '@atlaskit/form';
import { Flex } from '@atlaskit/primitives/compiled';
import TextField from '@atlaskit/textfield';

const LabelStandaloneExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Label htmlFor="label-standalone-email">Work email</Label>
		<TextField id="label-standalone-email" name="email" type="email" />
	</Flex>
);

export default LabelStandaloneExample;
