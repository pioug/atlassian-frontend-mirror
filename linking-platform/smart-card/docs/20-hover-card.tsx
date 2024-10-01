import { code } from '@atlaskit/docs';
import React from 'react';
import examples from './content/hover-card/examples';
import reference from './content/hover-card/reference';
import { TabName } from './utils';

import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';

export default customMd`

### Introduction
Hover cards can be used as a standalone component to wrap any other React component to display information about a supplied URL upon hovering on
the child component. Depending on the resource type, different actions will be displayed.

### Installation

${code`
yarn add @atlaskit/smart-card
`}

### Quick start
The bare minimum is similar to Flexible ui:

- **SmartCardProvider** contains react context and the HTTP client that powers Smart Links.
  It is recommended to have single Provider per page for the best performance.
- **CardClient** is a HTTP client which interacts with the Object Resolver Service, or a service of your own.
  Use \`stg\`/\`staging\` for staging and \`prod\`/\`production\` for production environment.
- **HoverCard** is the component we use to supply the hover card. It can be accessed at \`@atlaskit/smart-card/hover-card\`
  along with the hover card prop interface, \`HoverCardProps\`.

You simply wrap your current component, supply a URL and the hover card will do the rest.

${code`
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { HoverCard } from '@atlaskit/smart-card/hover-card';

// To use staging environment, you must be logged in at
// https://pug.jira-dev.com
<SmartCardProvider client={new CardClient('stg')}>
  <HoverCard url="https://www.atlassian.com/">
    <div>
      Hover over me!
    </div>
  </HoverCard>
</SmartCardProvider>
`}

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
