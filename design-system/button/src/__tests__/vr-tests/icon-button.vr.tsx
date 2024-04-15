import { snapshot } from '@af/visual-regression';

import IconButtonExample from '../../../examples/07-icon-button';

import { themeVariants } from './utils';

snapshot(IconButtonExample, {
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
