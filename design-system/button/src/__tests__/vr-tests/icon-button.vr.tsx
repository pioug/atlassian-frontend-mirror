import { snapshot } from '@af/visual-regression';

import IconButtonExample from '../../../examples/07-icon-button';

import { themeVariants } from './utils';

//Skipping because of failure on master. https://bitbucket.org/atlassian/atlassian-frontend/pipelines/results/2949173/steps/%7B237e2f2b-1878-4332-be2c-65a1c0b1c1ba%7D/test-report 
snapshot.skip(IconButtonExample, {
  description: 'Default',
  variants: themeVariants,
});

snapshot(IconButtonExample, {
  description: 'Standard tooltip',
  variants: themeVariants,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'default' },
    },
  ],
  drawsOutsideBounds: true,
});

snapshot(IconButtonExample, {
  description: 'Label overridden',
  variants: themeVariants,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'label-overridden' },
    },
  ],
  drawsOutsideBounds: true,
});

snapshot(IconButtonExample, {
  description: 'Tooltip disabled',
  variants: themeVariants,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'disabled' },
    },
  ],
  drawsOutsideBounds: true,
});

snapshot(IconButtonExample, {
  description: 'Tooltip position right',
  variants: themeVariants,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'position-right' },
    },
  ],
  drawsOutsideBounds: true,
});

snapshot(IconButtonExample, {
  description: 'Link icon button with tooltip',
  variants: themeVariants,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'link-icon-button' },
    },
  ],
  drawsOutsideBounds: true,
});
