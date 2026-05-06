import { ffTest } from '@atlassian/feature-flags-test-utils';

import {
	getAtlassianStudioAgentDuplicateUrl,
	getAtlassianStudioAgentEditUrl,
	getStudioHost,
	getStudioPath,
} from './index';

jest.mock('@atlassian/studio-entry-link', () => ({
	getStudioSessionSyncUrl: jest.fn(
		(env: string, path: string, email: string) =>
			`https://studio-sync.example.com/${env}${path}?login_hint=${encodeURIComponent(email)}`,
	),
}));

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
		expect(getStudioHost()).toBe(
			'https://atlassian-studio.stg-east.frontend.public.atl-paas.net',
		);
		Object.defineProperty(window, 'location', {
			value: { host: 'hello.atlassian.net' },
			writable: true,
		});
	});
});

describe('getStudioPath', () => {
	it('returns absolute URL for a given path', () => {
		expect(getStudioPath('/s/site/agents')).toBe(
			'https://studio.atlassian.com/s/site/agents',
		);
	});

	describe('asf-944-account-sync feature gate', () => {
		ffTest.off('asf-944-account-sync', 'gate off - ignores email and falls back to plain URL', () => {
			it('ignores email when gate is off', () => {
				expect(getStudioPath('/s/site/agents', 'user@example.com')).toBe(
					'https://studio.atlassian.com/s/site/agents',
				);
			});
		});

		ffTest.on('asf-944-account-sync', 'gate on - uses session sync URL when email provided', () => {
			it('returns session sync URL when email is provided', () => {
				const url = getStudioPath('/s/site/agents', 'user@example.com');
				expect(url).toContain('studio-sync.example.com/production');
				expect(url).toContain('/s/site/agents');
				expect(url).toContain('login_hint=user%40example.com');
			});

			it('falls back to plain URL when email is not provided', () => {
				const url = getStudioPath('/s/site/agents');
				expect(url).toBe('https://studio.atlassian.com/s/site/agents');
			});

			it('falls back to plain URL when email is empty string', () => {
				const url = getStudioPath('/s/site/agents', '');
				expect(url).toBe('https://studio.atlassian.com/s/site/agents');
			});
		});
	});
});

describe('getAtlassianStudioAgentEditUrl', () => {
	describe('asf-944-account-sync feature gate', () => {
		ffTest.off('asf-944-account-sync', 'gate off - ignores email and falls back to plain URL', () => {
			it('returns the agent edit URL without login_hint', () => {
				const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID);
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
				);
			});

			it('ignores email when gate is off', () => {
				const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID, 'user@example.com');
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
				);
			});
		});

		ffTest.on('asf-944-account-sync', 'gate on - uses session sync URL when email provided', () => {
			it('returns session sync URL with login_hint when email is provided', () => {
				const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID, 'user@example.com');
				expect(url).toContain('studio-sync.example.com/production');
				expect(url).toContain(`/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}`);
				expect(url).toContain('login_hint=user%40example.com');
			});

			it('falls back to plain URL when email is not provided', () => {
				const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID);
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
				);
			});
		});
	});
});

describe('getAtlassianStudioAgentDuplicateUrl', () => {
	describe('asf-944-account-sync feature gate', () => {
		ffTest.off('asf-944-account-sync', 'gate off - ignores email and falls back to plain URL', () => {
			it('returns the agent duplicate URL without login_hint', () => {
				const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID);
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
				);
			});

			it('ignores email when gate is off', () => {
				const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID, 'user@example.com');
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
				);
			});
		});

		ffTest.on('asf-944-account-sync', 'gate on - uses session sync URL when email provided', () => {
			it('returns session sync URL with login_hint when email is provided', () => {
				const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID, 'user@example.com');
				expect(url).toContain('studio-sync.example.com/production');
				expect(url).toContain(`/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}`);
				expect(url).toContain('login_hint=user%40example.com');
			});

			it('falls back to plain URL when email is not provided', () => {
				const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID);
				expect(url).toBe(
					`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
				);
			});
		});
	});
});
