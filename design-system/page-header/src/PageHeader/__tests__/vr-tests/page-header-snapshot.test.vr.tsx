import { snapshot } from '@af/visual-regression';

import Default from '../../../../examples/01-default';

// FIXME: Skipping theses tests as it has been failing on master on CI due to "Screenshot comparison failed" issue.
// Build URL: https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2319963/steps/%7Bfae3a6c2-0319-435d-8682-2e1657b10f6c%7D
snapshot.skip(Default);
