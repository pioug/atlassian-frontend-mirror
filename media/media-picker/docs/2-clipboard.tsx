import React from 'react';
import { md } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import clipBoardExamples from './content/clipboard/example';
import clipBoardProps from './content/clipboard/props';
export default md`

  ### Clipboard

  The \`Clipboard\` React component provides copy &amp; paste capabilities. This allows the user to paste copied files into the browser.

  _It provides with \`container\` and \`onPaste()\` params in \`config\` \`prop\` to set the boundary of the pasted zone. These two params are designed to address customer dissatisfaction when attachments are pasted duplicated, or to unwanted Jira issues (https://product-fabric.atlassian.net/browse/MEX-2454). _

  ${(
    <DocsContentTabs
      tabs={[
        { name: 'Usage', content: clipBoardExamples },
        { name: 'Props', content: clipBoardProps },
      ]}
    />
  )}

`;
