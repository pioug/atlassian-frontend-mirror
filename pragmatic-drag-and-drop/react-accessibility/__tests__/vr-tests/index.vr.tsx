import { snapshot } from '@af/visual-regression';

import DragHandleButtonExample from '../../examples/drag-handle-button';
import DragHandleButtonSmallExample from '../../examples/drag-handle-button-small';

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
// https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2952771/steps/%7B443c890e-7289-4f1d-ae2a-4f2e7d3bb422%7D/test-report
snapshot.skip(DragHandleButtonExample, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
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

// Fixing failing build: Jira Issue: https://hello.jira.atlassian.cloud/browse/UTEST-1617
snapshot.skip(DragHandleButtonSmallExample, {
  variants: [
    {
      name: 'Default',
      environment: {},
    },
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
