import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives';
import Toggle from '@atlaskit/toggle';

export default () => {
	const ref = React.createRef<HTMLInputElement>();

	const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (ref.current) {
			console.log(ref.current.checked);
		}
	};

	return (
		<Stack>
			<Label htmlFor="toggle">Toggle</Label>
			<Toggle id="toggle" defaultChecked onChange={onChange} ref={ref} />
		</Stack>
	);
};
