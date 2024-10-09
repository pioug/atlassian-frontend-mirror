import { code } from '@atlaskit/docs';
import React from 'react';
import CustomExample from '../../utils/custom-example';
import customMd from '../../utils/custom-md';
import prerequisites from '../prerequisites';

export default customMd`

Flexible Smart Links, also known as FlexibleCard, Flexible UI, and Flex UI, is a composable system made up of data elements inside UI blocks,
built by Linking Platform to aid Atlassian product teams in creating their own contextually appropriate Smart Link views,
without being dependent on Linking Platform.
This system does not affect inline, block or embed views of links.

&nbsp;

${prerequisites}

### Installation

${code`yarn add @atlaskit/smart-card`}

### Usage

The following code example will render the Flexible Smart Link with basic configuration.

${code`
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { Card, TitleBlock } from '@atlaskit/smart-card';

// To use staging environment, you must be logged in at https://pug.jira-dev.com
<SmartCardProvider client={new CardClient('stg')}>
  <Card appearance="block" url="https://www.atlassian.com/">
    <TitleBlock />
  </Card>
</SmartCardProvider>
`}

### Building the UI

The Flexible Smart Links are organised into two separate concepts:

* **Blocks** (composed rows of metadata e.g. TitleBlock)

* **Elements** (single pieces of metadata e.g. CreatedBy)

When creating a UI, it is best to first determine which blocks
to use as this will determine the overall layout of the Smart Link.
We have some pre-made blocks that are ready for grab.

Check out the links on the top of this document to discover what this awesome feature has to offer.

### Tools

A few useful tools to help visualise your linking vision.

* Flexible Smart Links Builder ([go/flexible-smart-links-builder](http://go/flexible-smart-links-builder))
* JSON-LD Editor ([go/smart-links-jsonld-editor](http://go/smart-links-jsonld-editor))

### Here are some ideas to get you started!

UI props (FlexibleUiOptions) can be combined to provide a wide range of bespoke-looking integrations.
For example, we can hide the background, elevation and padding,
creating the “list” appearance common in Atlassian sidebars.

${(
	<CustomExample
		Component={require('../../../examples/content/flexible-ui-list').default}
		source={require('!!raw-loader!../../../examples/content/flexible-ui-list')}
	/>
)}

Use TitleBlock together with PreviewBlock, MetadataBlock, SnippetBlock, and FooterBlock
can create a comprehensive content for the link resource.

${(
	<CustomExample
		Component={require('../../../examples/content/flexible-ui-card').default}
		source={require('!!raw-loader!../../../examples/content/flexible-ui-card')}
	/>
)}

There is no limit on how many blocks you can put inside Flexible Smart Links.
Repeat the MetadataBlock to enrich the linking experience.

${(
	<CustomExample
		Component={require('../../../examples/content/flexible-ui-card-list').default}
		source={require('!!raw-loader!../../../examples/content/flexible-ui-card-list')}
	/>
)}

This is just the beginning!
Linking Platform is continuing to add more features to improve Flexible Smart Links.
Any feedback and suggestions are greatly appreciated.
Come chat with us at [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV).

`;
