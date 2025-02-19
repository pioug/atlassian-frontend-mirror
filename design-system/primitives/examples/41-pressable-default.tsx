import React from 'react';

import { Pressable } from '@atlaskit/primitives';

export default function Default() {
	return (
		<Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
			Press me
		</Pressable>
	);
}
