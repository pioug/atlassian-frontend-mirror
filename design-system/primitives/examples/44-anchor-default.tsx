import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Anchor } from '@atlaskit/primitives';

export default function Default(): React.JSX.Element {
	return (
		<Anchor testId="anchor-default" href="/home">
			I am an anchor
		</Anchor>
	);
}
