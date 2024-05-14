import { snapshot } from '@af/visual-regression';

import OverlayExample from '../../../examples/35-overlay';

import { themeVariants } from './utils';

// Flaky Test https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2931486/steps/%7B5f737942-11d5-445b-ace2-954094bc1349%7D
snapshot.skip(OverlayExample, {
  variants: themeVariants,
});
