import React from 'react';

import { Stack } from '@atlaskit/primitives/compiled';
import Tag from '@atlaskit/tag';

export default (): React.JSX.Element => (
	<Stack space="space.100">
		<Tag text="Gray" color="gray" />
		<Tag text="Blue" color="blue" />
		<Tag text="Red" color="red" />
		<Tag text="Yellow" color="yellow" />
		<Tag text="Green" color="green" />
		<Tag text="Teal" color="teal" />
		<Tag text="Purple" color="purple" />
		<Tag text="Lime" color="lime" />
		<Tag text="Orange" color="orange" />
		<Tag text="Magenta" color="magenta" />
	</Stack>
);
