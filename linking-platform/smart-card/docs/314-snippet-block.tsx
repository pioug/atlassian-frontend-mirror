import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/snippet-block/examples';
import reference from './content/snippet-block/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: SnippetBlock

A snippet block provides a description for a link.
Its data is mapped to \`summary\` from a link resolver.

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
