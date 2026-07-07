import React from 'react';

import Heading from '@atlaskit/heading';
import DatabaseObjectTile from '@atlaskit/object/tile/database';
import EpicObjectTile from '@atlaskit/object/tile/epic';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

export default function ObjectTileLabelling(): React.JSX.Element {
	return (
		<Stack space="space.200">
			<Heading size="medium">Non-decorative tile with a default label</Heading>
			{/* No label prop needed - defaults to the content type name "Epic" */}
			<EpicObjectTile />
			<Heading size="medium">Non-decorative tile with a custom label</Heading>
			<EpicObjectTile label="Create an Epic" />
			<Heading size="medium">Decorative tile without a label</Heading>
			<Inline space="space.100" alignBlock="center">
				{/* This tile is already described by accompanying text, so no label is needed */}
				<DatabaseObjectTile label="" />
				<Heading size="small">Database</Heading>
			</Inline>
		</Stack>
	);
}
