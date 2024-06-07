import { snapshot } from '@af/visual-regression';
import HoverCard from '../../../examples/vr-hover-card-standalone/vr-hover-card-layout';
import HoverCardWithPreview from '../../../examples/vr-hover-card-standalone/vr-hover-card-with-image-preview';
import HoverCardForSlackMessage from '../../../examples/vr-hover-card-standalone/vr-hover-card-for-slack-message';
import HoverCardConfluence from '../../../examples/vr-hover-card-standalone/vr-hover-card-confluence';
import HoverCardAssignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-assigned-issue';
import HoverCardUnassignedJiraIssue from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-unassigned-issue';
import HoverCardJiraProject from '../../../examples/vr-hover-card-standalone/vr-hover-card-jira-project';
import HoverCardForbiddenJira from '../../../examples/vr-hover-card-standalone/vr-hover-card-forbidden-jira';

snapshot(HoverCard, {
	description: 'standalone hover card deafult',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardWithPreview, {
	description: 'standalone hover card with image Preview',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardForSlackMessage, {
	description: 'standalone hover card for Slack message',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardConfluence, {
	description: 'standalone hover card for Confluence',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardAssignedJiraIssue, {
	description: 'standalone hover card for Assigned Jira Issie',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardUnassignedJiraIssue, {
	description: 'standalone hover card for Unassigned Jira Issie',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardJiraProject, {
	description: 'standalone hover card for Jira Project',
	states: [{ state: 'hovered', selector: { byRole: 'button' } }],
	drawsOutsideBounds: true,
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with direct_access context for Jira ',
	states: [
		{
			state: 'hovered',
			selector: { byTestId: 'DIRECT_ACCESS' },
		},
	],
	drawsOutsideBounds: true,
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
});

snapshot(HoverCardForbiddenJira, {
	description: 'standalone hover card forbidden view with forbidden context for Jira',
	states: [{ state: 'hovered', selector: { byTestId: 'FORBIDDEN' } }],
	drawsOutsideBounds: true,
});
