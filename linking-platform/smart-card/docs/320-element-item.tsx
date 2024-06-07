import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/element-item/examples';
import reference from './content/element-item/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: ElementItem

Some Flexible Smart Links blocks such as [TitleBock](./title-block) and [MetadataBlock](./metadata-block) offer areas to host
optional metadata elements.
These elements represent link metadata and are subjected to data availability.
If the element is defined in the block props
but the link does not have data for the element,
the element will simply not show up.

If you find a link that should have the data for the element
but the element does not show up,
it could be a case that our link resolver needed an updated.
Come chat with us at [#help-linking-platform](https://atlassian.slack.com/archives/CFKGAQZRV)
and we will be happy to look in to it.
Or if your team would like to contribute to our link resolvers or even create one of your own, let us know!
Let's making the linking experience better for everyone!

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
