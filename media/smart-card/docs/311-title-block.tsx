import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/title-block/examples';
import reference from './content/title-block/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: TitleBlock

A title block is the foundation of Flexible Smart Links feature in Smart Links.
It contains an icon, the link, and any associated metadata and actions in one block.
The TitleBlock will also render differently given the state of the smart link.
This can be found in the corresponding Resolving, Resolved and Errored views.

${(
  <ContentTabs
    tabs={[
      { name: TabName.Examples, content: examples },
      { name: TabName.Reference, content: reference },
    ]}
  />
)}
`;
