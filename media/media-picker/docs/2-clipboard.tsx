import React from 'react';
import { md } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import clipBoardExamples from './content/clipboard/example';
import clipBoardProps from './content/clipboard/props';
export default md`

  ### Clipboard

  The \`Clipboard\` React component provides copy &amp; paste capabilities. This allows the user to paste copied files into the browser.

  _It does not have any additional configuration beyond the base configuration options available._

  ${(
    <DocsContentTabs
      tabs={[
        { name: 'Usage', content: clipBoardExamples },
        { name: 'Props', content: clipBoardProps },
      ]}
    />
  )}

`;
