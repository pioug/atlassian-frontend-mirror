import React from 'react';
import StagingCardExample from '../../../examples/content/staging-card-example';
import customMd from '../../utils/custom-md';

export default customMd`

This action allows users to change the status of a Jira issue directly from the Smart Link.
It is designed to reduce context switching by enabling quick updates to issue statuses without needing to open the full Jira interface

It requires the user to have access to the Jira project.

${(<StagingCardExample url="https://spitz.jira-dev.com/browse/PAW-13" />)}

**Components:** [block card](./block-card), [hover card](./hover-card), [flexible card](./flexible-card)

**Availability:**  Jira ([jira-object-provider](https://bitbucket.org/atlassian/jira-object-provider))

`;
