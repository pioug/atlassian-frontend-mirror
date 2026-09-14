import React from 'react';

import { Text } from '@atlaskit/primitives/compiled';

export const generateMentionItem = (
	component: JSX.Element,
	description?: string,
): React.JSX.Element => (
	<div>
		<Text as="p">{description}</Text>
		{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
		<ul style={{ padding: 0 }}>{component}</ul>
	</div>
);
