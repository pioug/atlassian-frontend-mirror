import React, { useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import Toggle from '@atlaskit/toggle/toggle';

export default function ToggleMotionExample(): React.JSX.Element {
	const [checked, setChecked] = useState(false);

	return (
		<Stack space="space.200">
			<Toggle label="Regular toggle" testId="motion-regular" />
			<Toggle label="Large toggle" testId="motion-large" size="large" />
			<Toggle label="Disabled toggle" testId="motion-disabled" isDisabled isChecked={checked} />
			<Toggle label="Loading toggle" testId="motion-loading" isLoading isChecked={checked} />
			<Button onClick={() => setChecked(!checked)}>Change controlled state</Button>
		</Stack>
	);
}
