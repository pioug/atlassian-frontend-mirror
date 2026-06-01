import React from 'react';

import { Pressable } from '@atlaskit/primitives/compiled';

export default function Default(): React.JSX.Element {
	return (
		<Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
			Press me
		</Pressable>
	);
}
