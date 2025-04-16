import React from 'react';

import { Box } from '@atlaskit/primitives';
import { Card } from '@atlaskit/smart-card';

import CardViewExample from '../../../examples/card-view';
import EmbedCardExample from '../../../examples/content/embed-card';
import { ResolvedClientEmbedUrl } from '../../../examples/utils/custom-client';
import customMd from '../../utils/custom-md';
import embedExplained from '../embed-explained';
import state_description from '../state-description';

export default customMd`

Smart Links embed enables users to seamlessly integrate and engage with content from different sources directly within Atlassian products.
This functionality boosts productivity by minimising the necessity to switch between tools, offering a smooth pathway to access and engage with linked content.

${(
	<Box paddingBlockStart="space.100">
		<EmbedCardExample />
	</Box>
)}

### Link response

${embedExplained}

### States

${state_description}

${(<CardViewExample appearance="embed" frameStyle="show" url={ResolvedClientEmbedUrl} CardComponent={Card} />)}
`;
