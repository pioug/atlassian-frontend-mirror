import React from 'react';

import { Pressable } from '@atlaskit/primitives';
import Tooltip from '@atlaskit/tooltip';

export default function DisabledWithTooltip() {
	return (
		// Tooltip should not display
		<Tooltip content="Tooltip content">
			<Pressable testId="pressable-disabled-with-tooltip" isDisabled>
				Disabled
			</Pressable>
		</Tooltip>
	);
}
