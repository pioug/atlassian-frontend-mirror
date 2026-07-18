import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import {
	getAtlassianStudioAgentDuplicateUrl,
	getAtlassianStudioAgentEditUrl,
	getStudioHost,
	getStudioPath,
} from './index';

// Default to production environment (non-staging host)
Object.defineProperty(window, 'location', {
	value: { host: 'hello.atlassian.net' },
	writable: true,
});

const SITE_ID = 'site-abc';
const AGENT_ID = 'agent-123';
const MANUAL_STUDIO_ENTRY_LINK_GATE = 'manual-studio-entry-link';

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
	it('returns absolute URL for a given path', () => {
		expect(getStudioPath('/s/site/agents')).toBe('https://studio.atlassian.com/s/site/agents');
	});

	describe('manual-studio-entry-link feature gate', () => {
		it('ignores email when gate is off', () => {
			failGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			expect(getStudioPath('/s/site/agents', 'user@example.com')).toBe(
				'https://studio.atlassian.com/s/site/agents',
			);
		});

		it('returns session sync URL when email is provided', () => {
			passGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getStudioPath('/s/site/agents', 'user@example.com');
			expect(url).toBe('https://studio.atlassian.com/s/site/agents?login_hint=user%40example.com');
		});

		it('preserves existing query params when adding login_hint', () => {
			passGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getStudioPath('/s/site/agents?redirect=%2Fcreate', 'user@example.com');
			expect(url).toBe(
				'https://studio.atlassian.com/s/site/agents?redirect=%2Fcreate&login_hint=user%40example.com',
			);
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

describe('getAtlassianStudioAgentEditUrl', () => {
	describe('manual-studio-entry-link feature gate', () => {
		it('returns the agent edit URL without login_hint', () => {
			const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID);
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
			);
		});

		it('ignores email when gate is off', () => {
			failGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID, 'user@example.com');
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
			);
		});

		it('returns session sync URL with login_hint when email is provided', () => {
			passGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID, 'user@example.com');
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview&login_hint=user%40example.com`,
			);
		});

		it('falls back to plain URL when email is not provided', () => {
			const url = getAtlassianStudioAgentEditUrl(SITE_ID, AGENT_ID);
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2F%3AagentId%2Foverview`,
			);
		});
	});
});

describe('getAtlassianStudioAgentDuplicateUrl', () => {
	describe('manual-studio-entry-link feature gate', () => {
		it('returns the agent duplicate URL without login_hint', () => {
			const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID);
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
			);
		});

		it('ignores email when gate is off', () => {
			failGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID, 'user@example.com');
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
			);
		});

		it('returns session sync URL with login_hint when email is provided', () => {
			passGate(MANUAL_STUDIO_ENTRY_LINK_GATE);

			const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID, 'user@example.com');
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate&login_hint=user%40example.com`,
			);
		});

		it('falls back to plain URL when email is not provided', () => {
			const url = getAtlassianStudioAgentDuplicateUrl(SITE_ID, AGENT_ID);
			expect(url).toBe(
				`https://studio.atlassian.com/s/${SITE_ID}/agents/enrich/rovo/agents/${AGENT_ID}?redirect=%2Fcreate`,
			);
		});
	});
});
