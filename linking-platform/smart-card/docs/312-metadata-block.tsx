import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/metadata-block/examples';
import reference from './content/metadata-block/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: MetadataBlock

A metadata block is designed to contain groups of metadata in the form of elements.
Accepts an array of elements to be shown either primary (left hand side) or secondary (right hand side).

${(
  <ContentTabs
    tabs={[
      { name: TabName.Examples, content: examples },
      { name: TabName.Reference, content: reference },
    ]}
  />
)}
`;
