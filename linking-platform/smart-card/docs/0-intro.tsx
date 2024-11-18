import React from 'react';

import { AtlassianInternalWarning } from '@atlaskit/docs';

import Menu from './content/menu';
import customMd from './utils/custom-md';
import QuickLinks from './utils/quick-links';

export default customMd`

${(<AtlassianInternalWarning />)}

&nbsp;

${(<QuickLinks />)}

The package \`@atlaskit/smart-card\` provides the frontend component for Smart Links.
To access the documentation, please click on the dropdown menu located on the right side, or select a component or topic from the list provided below.

&nbsp;

${(<Menu />)}

`;
