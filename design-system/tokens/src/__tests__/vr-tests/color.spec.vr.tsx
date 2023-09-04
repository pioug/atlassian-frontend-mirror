// eslint-disable-next-line import/no-extraneous-dependencies
import { snapshot } from '@af/visual-regression';

import CustomThemeVr from '../../../examples/9-custom-theme';

// FIXME: This test is skipped because it is flaky in CI - https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/1629665/steps/%7B6d28caa1-6900-40fc-9bd9-313df65b1093%7D/test-report
snapshot.skip(CustomThemeVr, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
  ],
});
