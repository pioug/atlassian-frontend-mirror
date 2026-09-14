import React from 'react';

import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import Tooltip from '@atlaskit/tooltip/Tooltip';

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
