import { code } from '@atlaskit/docs';
import React from 'react';
import StagingCardExample from '../../../examples/content/staging-card-example';
import customMd from '../../utils/custom-md';

export default customMd`

The AI summary action generates a concise summary of the linked content using artificial intelligence.
This helps users quickly understand the content without needing to open the link, thus reducing cognitive load and context switching

${(<StagingCardExample appearance="inline" showHoverPreview url="https://pug.jira-dev.com/wiki/spaces/~155970407/pages/453709758494" />)}

**Components:** [hover card](./hover-card)

**Availability:**
	Confluence ([confluence-object-provider](https://bitbucket.org/atlassian/confluence-object-provider)),
	Jira ([jira-object-provider](https://bitbucket.org/atlassian/jira-object-provider)),
	Google Drive ([gdrive-object-provider](https://bitbucket.org/atlassian/forge-smart-links/src/master/resolvers/gdrive))

AI summary action is link to admin setting and it's required to be passed to \`SmartCardProvider\` with \`isAdminHubAIEnabled\` prop in FE.
Additionally, \`product\` also need to be set.

${code`
<SmartCardProvider isAdminHubAIEnabled={true} product="CONFLUENCE">
	...
</SmartCardProvider>
`}

Links that support this feature, must specify it \`meta.supportedFeature\` in link response.

${code`
{
  "meta": {
    "supportedFeature": ['AISummary'],
    ...
  },
  "data": { ... }
}
`}

`;
