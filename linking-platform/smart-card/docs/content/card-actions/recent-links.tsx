import { code } from '@atlaskit/docs';

import customMd from '../../utils/custom-md';

export default customMd`

This action provides users with links to related content or resources.
It helps in exploring additional information that is contextually connected to the current link

**Components:** [hover card](./hover-card)

**Availability:**  Unavailable (dogfooding)

Links that support this feature, must specify it \`meta.supportedFeature\` in link response.

${code`
{
  "meta": {
    "supportedFeature": ['RelatedLinks'],
    ...
  },
  "data": { ... }
}
`}
`;
