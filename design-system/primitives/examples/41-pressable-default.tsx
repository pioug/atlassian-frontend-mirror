import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable } from '@atlaskit/primitives/compiled';

export default function Default(): React.JSX.Element {
	return (
		<Pressable testId="pressable-default" onClick={() => alert('Pressed')}>
			Press me
		</Pressable>
	);
}
