import { snapshot } from '@af/visual-regression';
import HoverCard from '../../../examples/vr-hover-card/vr-hover-card-layout';
import HoverCardWithPreview from '../../../examples/vr-hover-card/vr-hover-card-with-image-preview';
import HoverCardForSlackMessage from '../../../examples/vr-hover-card/vr-hover-card-for-slack-message';

snapshot(HoverCard, {
  description: 'Standalone hover card deafult',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

//Same list of tests for refreshed hover card design under the FF
//TODO: Delete during the 'platform.linking-platform.smart-card.show-smart-links-refreshed-design' FF clean up

snapshot(HoverCard, {
  description: 'Refreshed standalone hover card deafult',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
    },
  },
});

snapshot(HoverCardWithPreview, {
  description: 'Standalone hover card  with image Preview',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

//Same list of tests for refreshed hover card design & better metadata under the FF
snapshot(HoverCardWithPreview, {
  description: 'Redesigned Standalone hover card with image Preview',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
      'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
    },
  },
});

//Same list of tests for refreshed hover card design & better metadata under the FF
snapshot(HoverCardForSlackMessage, {
  description: 'Standalone hover card for Slack message',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  hooks: {
    featureFlags: {
      'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
        true,
      'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
    },
  },
});
