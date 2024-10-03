import { CardClient } from '@atlaskit/link-provider';
import CardViewSection from '../../../examples/card-view/card-view-section';
import { ResolvedClient } from '../../../examples/utils/custom-client';
import customMd from '../../utils/custom-md';
import React from 'react';

const resolvedClient = new ResolvedClient();
const url = 'https://project-url';

export default customMd`

### Appearance

Card component has three default appearances.

#### Inline

*< brief description />*

${(<CardViewSection appearance="inline" client={resolvedClient} title="" url={url} />)}

[Go to inline card docs](./inline-card)

#### Block

*< brief description />*

${(<CardViewSection appearance="block" client={resolvedClient} title="" url={url} />)}

[Go to block card docs](./block-card)

#### Embed

*< brief description />*

${(<CardViewSection appearance="embed" client={new CardClient('stg')} frameStyle="show" title="" url="https://youtu.be/hENQFInHMs0?si=9_IZk_uGOBsh4D0a" />)}

[Go to embed card docs](./embed-card)

### Configurable card (FlexibleCard)

*< brief description />*

[Go to flexible card docs](./flexible-card)

### *< common props />*

`;
