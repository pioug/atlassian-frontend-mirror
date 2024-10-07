import { code } from '@atlaskit/docs';
import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

In the Fabric Editor - wrap your instance of the Editor:

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';

<SmartCardProvider>
  <ComposableEditor />
</SmartCardProvider>
`}

In the Fabric Renderer - wrap your instance of the Renderer:

${code`
import { SmartCardProvider } from '@atlaskit/link-provider';
import { Renderer } from '@atlaskit/renderer';

<SmartCardProvider>
  <Renderer />
</SmartCardProvider>
`}

`;
