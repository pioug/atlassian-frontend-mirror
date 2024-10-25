import React from 'react';

import { Box } from '@atlaskit/primitives';

import CardViewExample from '../../../examples/card-view';
import ExampleBlockCard from '../../../examples/content/block-card';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

Smart Links with block appearance presents the link as a card, giving a more detailed view of the linked material.
It really stands out compared to the inline style and comes in handy when you need extra context or a preview of the content.

Within the editor, the block appearance is referred to as the "Card".

${(
	<Box paddingBlockStart="space.100">
		<ExampleBlockCard />
	</Box>
)}

### States

${state_description}

${(<CardViewExample appearance="block" frameStyle="show" />)}

`;
