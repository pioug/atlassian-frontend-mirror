import { AtlassianInternalWarning, code, md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`

${(<AtlassianInternalWarning />)}

# SmartCardProvider

\`SmartCardProvider\` is a core component for managing the rendering and functionality of linking components, specifically Smart Links.
Its primary purpose is to act as a wrapper that provides context and an HTTP client, which ensures efficient rendering.
It is recommended to use a single \`SmartCardProvider\` per page for optimal performance.

The component is responsible for data fetching and caching, interacting with the **Object Resolver Service** to resolve link metadata.

### Prerequisites

The following packages are  \`@atlaskit/link-provider\`'s peer dependencies.
Please check our [package.json](https://bitbucket.org/atlassian/atlassian-frontend-mirror/src/edc5ac5ccd46946bb17e59d01260dd5002580206/linking-platform/link-provider/package.json#lines-51) for versioning.

* \`react\`

### Installation

${code`yarn add @atlaskit/link-provider`}

### Usage

The following code example will render the inline Smart Link.

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';

<SmartCardProvider>
	<Card appearance="inline" url="https://link-url" />
</SmartCardProvider>
`}


For setting up \`SmartCardProvider\` for local environment and/or customisation of HTTP client that interacts with the **Object Resolver Service**,
please see **[CardClient](./link-provider/docs/client)**.

${(
	<Props heading="Props" props={require('!!extract-react-types-loader!./props/props-provider')} />
)}

`;
