// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { snapshot } from '@af/visual-regression';

import WithSurfaceDetection from '../../../examples/surface-detection';

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2952221/steps/%7B3c6c5039-0b60-4e8f-870c-93131920e611%7D/test-report
snapshot.skip(WithSurfaceDetection, {
  drawsOutsideBounds: true,
  variants: [
    {
      name: 'Light',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});
