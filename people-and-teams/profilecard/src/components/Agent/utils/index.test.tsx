import { getAtlassianStudioAgentDuplicateUrl } from './getAtlassianStudioAgentDuplicateUrl';
import { getAtlassianStudioAgentEditUrl } from './getAtlassianStudioAgentEditUrl';
import { getStudioHost } from './getStudioHost';
import { getStudioPath } from './getStudioPath';

// Default to production environment (non-staging host)
Object.defineProperty(window, 'location', {
	value: { host: 'hello.atlassian.net' },
	writable: true,
});

const SITE_ID = 'site-abc';
const AGENT_ID = 'agent-123';

describe('getStudioHost', () => {
	it('returns production URL on non-staging host', () => {
		expect(getStudioHost()).toBe('https://studio.atlassian.com');
	});

	it('returns staging URL on staging host', () => {
		Object.defineProperty(window, 'location', {
			value: { host: 'pug.jira-dev.com' },
			writable: true,
		});
		expect(getStudioHost()).toBe('https://atlassian-studio.stg-east.frontend.public.atl-paas.net');
		Object.defineProperty(window, 'location', {
			value: { host: 'hello.atlassian.net' },
			writable: true,
		});
	});
});

describe('getStudioPath', () => {
	it('returns absolute URL for a given path without email', () => {
		expect(getStudioPath('/s/site/agents')).toBe('https://studio.atlassian.com/s/site/agents');
	});

	it('returns session sync URL when email is provided', () => {
		expect(getStudioPath('/s/site/agents', 'user@example.com')).toBe(
			'https://studio.atlassian.com/s/site/agents?login_hint=user%40example.com',
		);
	});

	it('preserves existing query params when adding login_hint', () => {
		expect(getStudioPath('/s/site/agents?redirect=%2Fcreate', 'user@example.com')).toBe(
			'https://studio.atlassian.com/s/site/agents?redirect=%2Fcreate&login_hint=user%40example.com',
		);
	});

	it('falls back to plain URL when email is empty string', () => {
		expect(getStudioPath('/s/site/agents', '')).toBe('https://studio.atlassian.com/s/site/agents');
	});
});

describe('getAtlassianStudioAgentEditUrl', () => {
	it('returns the agent edit URL without login_hint', () => {
		expect(getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID)).toBe(
			`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
		);
	});

	it('returns session sync URL with login_hint when email is provided', () => {
		expect(getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID, 'user@example.com')).toBe(
			`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview&login_hint=user%40example.com`,
		);
	});
});

describe('getAtlassianStudioAgentDuplicateUrl', () => {
	it('returns the agent duplicate URL without login_hint', () => {
		expect(getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID)).toBe(
			`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
		);
	});

	it('returns session sync URL with login_hint when email is provided', () => {
		expect(getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID, 'user@example.com')).toBe(
			`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate&login_hint=user%40example.com`,
		);
	});
});
