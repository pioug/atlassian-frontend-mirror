import React from 'react';

import { Label } from '@atlaskit/form';
import { Stack } from '@atlaskit/primitives/compiled';
import Toggle from '@atlaskit/toggle';

export default (): React.JSX.Element => {
	const ref = React.createRef<HTMLInputElement>();

	const onChange = () => {
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
