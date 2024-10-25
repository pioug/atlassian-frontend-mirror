import React from 'react';

import StagingCardExample from '../../../examples/content/staging-card-example';
import customMd from '../../utils/custom-md';

export default customMd`

The follow action is available on Team (Atlas/Watermelon) project and goal Smart Links.
By following, users can receive updates or notifications related to the project or goal.

${(<StagingCardExample url="https://home.stg.atlassian.com/o/3f97e0d7-a8ca-4263-91bf-3015999c8e64/s/DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5/project/ATL-2717" />)}

**Components:** [block card](./block-card), [hover card](./hover-card), [flexible card](./flexible-card)

**Availability:**  Team ([watermelon-object-provider](https://bitbucket.org/atlassian/status))

`;
