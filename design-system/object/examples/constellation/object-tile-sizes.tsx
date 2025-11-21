import React from 'react';

import TaskObjectTile from '@atlaskit/object/tile/task';
import { Inline } from '@atlaskit/primitives/compiled';

export default function ObjectTileSizes(): React.JSX.Element {
	return (
		<Inline space="space.100" alignBlock="end">
			<TaskObjectTile size="xsmall" label="Extra small task tile (20px)" />
			<TaskObjectTile size="small" label="Small task tile (24px)" />
			<TaskObjectTile size="medium" label="Medium task tile (32px)" />
			<TaskObjectTile size="large" label="Large task tile (40px)" />
			<TaskObjectTile size="xlarge" label="Extra large task tile (48px)" />
		</Inline>
	);
}
