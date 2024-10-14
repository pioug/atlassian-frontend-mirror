import { code } from '@atlaskit/docs';
import React from 'react';
import CardExample from '../../../examples/content/card';
import customMd from '../../utils/custom-md';
import prerequisites from '../prerequisites';

export default customMd`

[Smart Links](#a) enhance URLs into interactive previews, offering a contextualized experience within Atlassian products.
They come in inline, block (card), and embed formats, respecting content permissions and compliance settings.

${(<CardExample />)}

&nbsp;

${prerequisites}

### Installation

${code`yarn add @atlaskit/smart-card`}

### Usage

The following code example will render the inline Smart Link with basic configuration.

${code`
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Card } from '@atlaskit/smart-card';

// To use staging environment, you must be logged in at https://pug.jira-dev.com
<SmartCardProvider client={new CardClient('staging')}>
  <Card appearance="inline" url="https://www.atlassian.com/" />
</SmartCardProvider>
`}

### Integrating with the Fabric Renderer/Editor

Please see [Card in Editor](./card-in-editor).

`;
