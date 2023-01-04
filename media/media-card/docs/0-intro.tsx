import React from 'react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import UsageTab from './content/usage';
import PropsDefinitionTab from './content/props-definition';
import BabelNotice from './content/babel-notice';

export default md`
${(<AtlassianInternalWarning />)}

${(<BabelNotice />)}

### Description
This package provides the capability to display a preview of a file that has been already uploaded. 
It leverages the returned id opon a successful file upload and does all the work required to show the preview. 
Additionaly it also takes care of displaying the upload status of the file.

  ${(
    <DocsContentTabs
      tabs={[
        { name: 'Usage', content: UsageTab },
        { name: 'Props Definition', content: PropsDefinitionTab },
      ]}
    />
  )}

  ### Error UI Design Matrix for Media Card

  In the past we have refactored the list of Media Card's error UI in 4 categories: \`Generic Error\`, \`Rate Limited Error\`, \`Polling Max Attempts Error\` and \`Upload Error\`.
  All of this is available to be previewed in Card View Matrix example page.

  The list of the error UI design can be referenced [here](https://product-fabric.atlassian.net/wiki/spaces/MEX/pages/3070230558/New+Error+UI+design+for+Media+Card+new+experience).

`;
