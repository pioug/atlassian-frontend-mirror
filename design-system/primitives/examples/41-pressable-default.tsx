import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable } from '@atlaskit/primitives';

export default function Default() {
	return (
		<Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
			Press me
		</Pressable>
	);
}
