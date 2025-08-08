import { snapshot } from '@af/visual-regression';

import HoverCardConfluence from '../../../examples/vr-hover-card-standalone/vr-hover-card-confluence';
import HoverCardForSlackMessage from '../../../examples/vr-hover-card-standalone/vr-hover-card-for-slack-message';
import HoverCardForbiddenJira from '../../../examples/vr-hover-card-standalone/vr-hover-card-forbidden-jira';
import HoverCardAssignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-assigned-issue';
import HoverCardJiraProject from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-project';
import HoverCardUnassignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-unassigned-issue';
import HoverCard from '../../../examples/vr-hover-card-standalone/vr-hover-card-layout';
import HoverCardWithPreview from '../../../examples/vr-hover-card-standalone/vr-hover-card-with-image-preview';

snapshot(HoverCard, {
	description: 'standalone hover card default',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardWithPreview, {
	description: 'standalone hover card with image Preview',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardForSlackMessage, {
	description: 'standalone hover card for Slack message',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardConfluence, {
	description: 'standalone hover card for Confluence',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardAssignedJiraIssue, {
	description: 'standalone hover card for Assigned Jira Issue',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardUnassignedJiraIssue, {
	description: 'standalone hover card for Unassigned Jira Issue',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardJiraProject, {
	description: 'standalone hover card for Jira Project',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with direct_access context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'DIRECT_ACCESS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-smart-card-remove-legacy-button': true,
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with request_access context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'REQUEST_ACCESS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-smart-card-remove-legacy-button': true,
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with pending_request_exists context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'PENDING_REQUEST_EXISTS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with denied_request_exists context for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'DENIED_REQUEST_EXISTS' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardForbiddenJira, {
	description:
		'standalone hover card forbidden view with access_exists context and visibility not_found for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'ACCESS_EXISTS-not_found' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {},
});

snapshot(HoverCardForbiddenJira, {
	description:
		'standalone hover card forbidden view with access_exists context and visibility restricted for Jira',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'ACCESS_EXISTS-restricted' },
		},
	],
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-smart-card-remove-legacy-button': true,
	},
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with forbidden context for Jira',
	states: [{ state: 'hovered', selector: { byTestId: 'FORBIDDEN' } }],
	drawsOutsideBounds: true,
	featureFlags: {},
});
