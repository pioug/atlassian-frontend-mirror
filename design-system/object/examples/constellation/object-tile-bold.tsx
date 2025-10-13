import React from 'react';

import Heading from '@atlaskit/heading';
import ChangesObjectTile from '@atlaskit/object/tile/changes';
import IncidentObjectTile from '@atlaskit/object/tile/incident';
import PageLiveDocObjectTile from '@atlaskit/object/tile/page-live-doc';
import { Inline, Stack } from '@atlaskit/primitives/compiled';

export default function ObjectTileBold() {
	return (
		<Stack space="space.200">
			<Heading size="medium">Default appearance</Heading>
			<Inline space="space.100">
				<PageLiveDocObjectTile />
				<ChangesObjectTile />
				<IncidentObjectTile />
			</Inline>
			<Heading size="medium">Bold appearance</Heading>
			<Inline space="space.100">
				<PageLiveDocObjectTile isBold />
				<ChangesObjectTile isBold />
				<IncidentObjectTile isBold />
			</Inline>
		</Stack>
	);
}
