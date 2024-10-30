import React from 'react';

import { Pressable } from '../src/compiled';

export default function Default() {
	return (
		<Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
			Press me
		</Pressable>
	);
}
