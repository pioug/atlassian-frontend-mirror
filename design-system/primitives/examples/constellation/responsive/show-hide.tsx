import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { Hide } from '@atlaskit/primitives/responsive/hide';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- TODO: migrate to @atlaskit/primitives/compiled
import { Show } from '@atlaskit/primitives/responsive/show';

export default function Example(): React.JSX.Element {
	return (
		<p>
			Please connect using your{' '}
			<Show below="md" as="span">
				mobile device
			</Show>
			<Hide below="md" as="span">
				desktop or laptop
			</Hide>
		</p>
	);
}
