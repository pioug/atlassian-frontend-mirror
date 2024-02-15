import { snapshot } from '@af/visual-regression';

import HoverCard from '../../../examples/vr-hover-card/vr-hover-cards';
import HoverCardUanuthorised from '../../../examples/vr-hover-card/vr-unauthorised-hover-cards';
import HoverCardSSRLoading from '../../../examples/vr-hover-card/vr-hover-cards-ssr-loading';
import HoverCardSSRError from '../../../examples/vr-hover-card/vr-hover-cards-ssr-error';
import HoverCardPositioning from '../../../examples/vr-hover-card/vr-hover-card-can-open-positioning';

snapshot(HoverCard, {
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-card-trigger-wrapper' },
    },
  ],
  variants: [
    {
      name: 'light mode',
      environment: {
        colorScheme: 'light',
      },
    },
    {
      name: 'dark mode',
      environment: {
        colorScheme: 'dark',
      },
    },
  ],
});

snapshot(HoverCardUanuthorised, {
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-card-trigger-wrapper' },
    },
  ],
});

snapshot(HoverCardSSRLoading, {
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-card-trigger-wrapper' },
    },
  ],
});

snapshot(HoverCardSSRError, {
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-card-trigger-wrapper' },
    },
  ],
});

snapshot(HoverCardPositioning, {
  description: 'hover-card: can open in left position',
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-test-can-open-left' },
    },
  ],
});
snapshot(HoverCardPositioning, {
  description: 'hover-card: can not open when disabled',
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-test-cannot-open' },
    },
  ],
});
snapshot(HoverCardPositioning, {
  description: 'hover-card: can open in right position',
  drawsOutsideBounds: true,
  states: [
    {
      state: 'hovered',
      selector: { byTestId: 'hover-test-can-open-right' },
    },
  ],
});
