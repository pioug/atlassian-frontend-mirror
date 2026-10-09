import React from 'react';

import { Label } from '@atlaskit/form/label/default';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Toggle from '@atlaskit/toggle/toggle';

export default (): React.JSX.Element => (
	<Stack>
		<Label htmlFor="regular">Regular (Checked by default)</Label>
		<Toggle id="regular" isChecked={true} testId={'toggle-button'} />
		<Label htmlFor="large">Large (checked by default)</Label>
		<Toggle id="large" size="large" defaultChecked />
	</Stack>
);
