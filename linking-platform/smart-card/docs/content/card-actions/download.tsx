import { code } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`

This action is available for links that point to downloadable content. It allows users to directly download the file or document.

It requires the user to have access to the downloadable content and have connected their Atlassian account to the support link provider.

**Components:**  [block card](./block-card), [hover card](./hover-card), [flexible card](./flexible-card)

**Availability:**  Box ([box-object-provider](https://bitbucket.org/atlassian/forge-smart-links/src/master/resolvers/box/)), Dropbox ([dropbox-object-provider](https://bitbucket.org/atlassian/forge-smart-links/src/master/resolvers/dropbox/))

To surface the download action, the resolved link response must contain \`atlassian:downloadUrl\` with \`schema:potentialAction\` specify \`"@type": "DownloadAction"\`.

${code`
{
  "meta": { ... },
  "data": {
	"atlassian:downloadUrl": "https://download.url",
    "schema:potentialAction": {
		"@id": "download",
		"@type": "DownloadAction",
		"name": "Download",
	},
    ...
  }
}
`}

**Breakdown**

* \`schema:potentialAction\` is to tell FE component to prioritise the action over others actions on card with block appearance. While the priority has no impact on hover card and flexible card, the data is still required for the action to show.
* \`atlassian:downloadUrl\` is the URL to downloadable content.

`;
