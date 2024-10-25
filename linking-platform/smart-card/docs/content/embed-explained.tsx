import { code } from '@atlaskit/docs';

import customMd from '../utils/custom-md';

export default customMd`

Not every link has an embed content.
To surface the embed content, the resolved link response must contain \`data.preview\`.
The frontend implementation must specify support \`platform\` that matches with \`data.preview["atlassian:supportedPlatforms"]\` from the link response.

${code`
{
  "meta": { ... },
  "data": {
    "preview": {
      "@type": "Link",
      "href": "https://embed-url",
      "atlassian:supportedPlatforms": ["web"],
      "atlassian:aspectRatio": 1.7778
    },
    ...
  }
}
`}

**Breakdown**

* \`preview\` is object containing embed content information.
* \`@type\` is the type of the data. For embed url, the type is \`Link\`.
* \`herf\` is the URL of the embed content that will be set on the iframe.
* \`atlassian:supportedPlatforms\` refers to supported platforms, web and/or mobile. This is used in conjunction with Card component's \`platform\` prop.
* \`atlassian:aspectRatio\` is the preferred aspect ration of the embed content. This only applies to embed card and has no impact on preview action.

`;
