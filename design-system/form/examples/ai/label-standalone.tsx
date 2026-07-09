import React from 'react';

import { Label } from '@atlaskit/form/label';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import TextField from '@atlaskit/textfield/text-field';

const LabelStandaloneExample = (): React.JSX.Element => (
	<Flex direction="column">
		<Label htmlFor="label-standalone-email">Work email</Label>
		<TextField id="label-standalone-email" name="email" type="email" />
	</Flex>
);

export default LabelStandaloneExample;
