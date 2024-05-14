import { snapshot } from '@af/visual-regression';

import AvatarGroupPlayground from '../../../../examples/10-avatar-group-playground';

snapshot(AvatarGroupPlayground);
snapshot(AvatarGroupPlayground, {
  description: 'More indicator should get outline on focus',
  states: [
    {
      state: 'focused',
      selector: { byTestId: 'grid--overflow-menu--trigger' },
    },
  ],
});

//Flaky test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/%7Ba97ecbf2-2bd1-4ec9-9c43-7f2d40fc5ff1%7D/steps/%7B92261852-a0e4-46a5-92dd-47b66d60a504%7D/test-report
snapshot.skip(AvatarGroupPlayground, {
  description: 'More indicator should get opacity onHover',
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'grid--overflow-menu--trigger' },
    },
  ],
});
