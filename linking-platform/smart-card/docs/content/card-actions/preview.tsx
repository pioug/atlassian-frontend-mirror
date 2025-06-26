import React from 'react';

import { ResolvedClientEmbedUrl } from '@atlaskit/link-test-helpers';

import StagingCardExample from '../../../examples/content/staging-card-example';
import embedExplained from '../../content/embed-explained';
import customMd from '../../utils/custom-md';

export default customMd`

The preview action provides a quick view of the content.
This helps users to get a glimpse of the content without opening the full link, saving time and reducing context switching

${(<StagingCardExample url={ResolvedClientEmbedUrl} />)}

**Components:** [block card](./block-card), [hover card](./hover-card), [flexible card](./flexible-card)

**Availability:** Any Smart Links with embed content

${embedExplained}

`;
