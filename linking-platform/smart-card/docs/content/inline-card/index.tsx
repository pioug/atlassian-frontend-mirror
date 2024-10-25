import React from 'react';

import { Box } from '@atlaskit/primitives';

import CardViewExample from '../../../examples/card-view';
import InlineExample from '../../../examples/content/inline-card';
import customMd from '../../utils/custom-md';
import state_description from '../state-description';

export default customMd`

Smart Link with inline appearance shows off the link right in the text, just like a regular hyperlink.
It's clean and sleek, fitting in smoothly with the rest of the content.

${(
	<Box paddingBlockStart="space.100">
		<InlineExample />
	</Box>
)}

### States

${state_description}

${(<CardViewExample appearance="inline" showAuthTooltip={true} showHoverPreview={true} />)}

`;
