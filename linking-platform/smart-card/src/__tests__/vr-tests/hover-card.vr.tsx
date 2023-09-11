import { snapshot } from '@af/visual-regression';
import HoverCard from '../../../examples/vr-hover-card/vr-hover-card-layout';
import HoverCardWithPreview from '../../../examples/vr-hover-card/vr-hover-card-with-image-preview';
import HoverCardForSlackMessage from '../../../examples/vr-hover-card/vr-hover-card-for-slack-message';
import HoverCardConfluence from '../../../examples/vr-hover-card/vr-hover-card-confluence';
import HoverCardAssignedJiraIssue from '../../../examples/vr-hover-card/vr-hover-card-jira-assigned-issue';
import HoverCardUnassignedJiraIssue from '../../../examples/vr-hover-card/vr-hover-card-jira-unassigned-issue';
import HoverCardJiraProject from '../../../examples/vr-hover-card/vr-hover-card-jira-project';

snapshot(HoverCard, {
  description: 'Standalone hover card deafult',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

snapshot(HoverCardWithPreview, {
  description: 'Standalone hover card with image Preview',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

snapshot(HoverCardForSlackMessage, {
  description: 'Standalone hover card for Slack message',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

snapshot(HoverCardConfluence, {
  description: 'Standalone hover card for Confluence',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

snapshot(HoverCardAssignedJiraIssue, {
  description: 'Standalone hover card for Assigned Jira Issie',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

snapshot(HoverCardJiraProject, {
  description: 'Standalone hover card for Jira Project',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
});

//Same list of tests for refreshed hover card design under the FF
//TODO: Delete during the 'platform.linking-platform.smart-card.show-smart-links-refreshed-design' FF clean up

snapshot(HoverCard, {
  description: 'Refreshed standalone hover card deafult',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
  },
});

snapshot(HoverCardWithPreview, {
  description: 'Redesigned Standalone hover card with image Preview',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});

snapshot(HoverCardForSlackMessage, {
  description: 'Refreshed Standalone hover card for Slack message',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});

snapshot(HoverCardConfluence, {
  description: 'Refreshed Standalone hover card for Confluence',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});

snapshot(HoverCardAssignedJiraIssue, {
  description: 'Refreshed Standalone hover card for Assigned Jira Issie',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});

snapshot(HoverCardUnassignedJiraIssue, {
  description: 'Refreshed Standalone hover card for Unassigned Jira Issie',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});

snapshot(HoverCardJiraProject, {
  description: 'Refreshed Standalone hover card for Jira Project',
  states: [{ state: 'hovered', selector: { byRole: 'button' } }],
  drawsOutsideBounds: true,
  featureFlags: {
    'platform.linking-platform.smart-card.show-smart-links-refreshed-design':
      true,
    'platform.linking-platform.smart-card.enable-better-metadata_iojwg': true,
  },
});
