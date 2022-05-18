import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/footer-block/examples';
import reference from './content/footer-block/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: FooterBlock

A footer block provides the source of the link, and some actions.
Typically used at the bottom of a Smart Link.

${(
  <ContentTabs
    tabs={[
      { name: TabName.Examples, content: examples },
      { name: TabName.Reference, content: reference },
    ]}
  />
)}
`;
