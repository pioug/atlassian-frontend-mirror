import React from 'react';
import { code } from '@atlaskit/docs';
import CustomExample from './utils/custom-example';
import customMd from './utils/custom-md';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';

export default customMd`
${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links

Flexible Smart Links is a composable system made up of data elements inside UI blocks,
built by Linking Platform to aid Atlassian product teams in creating their own contextually appropriate Smart Link views,
without being dependent on Linking Platform.
This system does not affect inline, block or embed views of links.

### Prerequisites

The following packages are  \`@atlaskit/smart-card\`'s peer dependencies
and required for Smart Links to function properly.
Please check our [package.json](https://bitbucket.org/atlassian/atlassian-frontend/src/master/packages/media/smart-card/package.json) for versioning.

* \`react\`
* \`react-dom\`
* \`react-intl-next\`
* \`@atlaskit/link-provider\`

### Installation

${code`yarn add @atlaskit/smart-card`}

### Quick start

Here's the bare minimum to get Flexible Smart Links running!

* **Provider** or **SmartCardProvider** contains react context
and HTTP client that powers Smart Links. It is recommended to have single
Provider per page for the best performance.

* **[Client](./client)** is a HTTP client which interacts with the
Object Resolver Service, or a service of your own. Use \`stg\`/\`staging\` for dog food
and \`prod\`/\`production\` for production environment.

* **Card** or often known as **SmartCard** is the top level component of Smart Links.
It offers a default inline, block and embed appearances, and now flexible ui.
(Card's block appearance is not to be confused with Flexible Smart Links blocks.)

* **[TitleBlock](./title-block)** is a compulsory block and the trigger of the Flexible Smart
Links UI rendering.

Really, it's a simple matter of putting TitleBlock component inside the Smart Links Card component. 😎

${code`
import { Card, Client, Provider, TitleBlock } from '@atlaskit/smart-card';

// To use staging environment, you must be logged in at
// https://commerce-components-preview.dev.atlassian.com
<Provider client={new Client('stg')}>
  <Card appearance="inline" url="https://www.atlassian.com/">
    <TitleBlock />
  </Card>
</Provider>
`}

### Building the UI

The Flexible Smart Links are organised into two separate concepts:

* **Blocks** (composed rows of metadata e.g. TitleBlock)

* **Elements** (single pieces of metadata e.g. CreatedBy)

When creating a UI, it is best to first determine which blocks
to use as this will determine the overall layout of the Smart Link.
We have some pre-made blocks that are ready for grab.

Check out the links below to discover what this awesome feature has to offer.

* [FlexibleUiOptions](./ui-options)
* [TitleBlock](./title-block)
* [MetadataBlock](./metadata-block)
* [PreviewBlock](./preview-block)
* [SnippetBlock](./snippet-block)
* [FooterBlock](./footer-block)
* [ElementItem](./element-item)
* [ActionItem](./action-item)

### Here are some ideas to get you started!

UI props ([FlexibleUiOptions](./ui-options)) can be combined to provide a wide range of bespoke-looking integrations.
For example, we can hide the background, elevation and padding,
creating the “list” appearance common in Atlassian sidebars.

${(
  <CustomExample
    Component={require('../examples/content/flexible-ui-list').default}
    source={require('!!raw-loader!../examples/content/flexible-ui-list')}
  />
)}

Use [TitleBlock](./title-block) together with [PreviewBlock](./preview-block), [MetadataBlock](./metadata-block), [SnippetBlock](./snippet-block), and [FooterBlock](./footer-block)
can create a comprehensive content for the link resource.

${(
  <CustomExample
    Component={require('../examples/content/flexible-ui-card').default}
    source={require('!!raw-loader!../examples/content/flexible-ui-card')}
  />
)}

There is no limit on how many blocks you can put inside Flexible Smart Links.
Repeat the [MetadataBlock](./metadata-block) to enrich the linking experience.

${(
  <CustomExample
    Component={require('../examples/content/flexible-ui-card-list').default}
    source={require('!!raw-loader!../examples/content/flexible-ui-card-list')}
  />
)}

This is just the beginning!
Linking Platform is continuing to add more features to improve Flexible Smart Links.
Any feedback and suggestions are greatly appreciated.
Come chat with us at [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV).

`;
