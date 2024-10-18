import { AtlassianInternalWarning } from '@atlaskit/docs';
import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

export default customMd`

${(<DocQuickLinks />)}

&nbsp;

${(<AtlassianInternalWarning />)}

&nbsp;

${(<InProgressMessage />)}

- [Card](./card)
- [HoverCard](./hover-card)
- [LinkUrl](./link-url)
- [Hooks](./hooks)

`;
