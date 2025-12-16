import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Pressable } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

export default function DisabledWithTooltip(): React.JSX.Element {
	return (
		// Tooltip should not display
		<Tooltip content="Tooltip content">
			<Pressable testId="pressable-disabled-with-tooltip" isDisabled>
				Disabled
			</Pressable>
		</Tooltip>
	);
}
