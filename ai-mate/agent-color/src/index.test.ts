import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getAgentColor } from './get-agent-color';

describe('getAgentColor', () => {
	it.each([
		['00000000', 'yellow'],
		['00000001', 'purple'],
		['00000002', 'lime'],
		['00000003', 'blue'],
		['00000004', 'yellow'],
	] as const)('selects %s from the stable agent ID', (agentId, color) => {
		expect(getAgentColor({ agentId })).toBe(color);
	});

	it('uses the identity account ID before the agent ID', () => {
		expect(getAgentColor({ agentId: '00000001', agentIdentityAccountId: '00000002' })).toBe('lime');
	});

	it('uses the configured colour for named agents', () => {
		expect(getAgentColor({ agentId: '00000000', agentNamedId: 'planner_agent' })).toBe('purple');
		expect(getAgentColor({ agentId: '00000000', agentNamedId: 'content_reviewer_agent' })).toBe(
			'blue',
		);
	});

	it('defaults to yellow when there is no hexadecimal identity', () => {
		expect(getAgentColor({ agentId: 'zzzzzzzz' })).toBe('yellow');
	});
});

// Use an ID that hashes to purple so every fixed alias differs from the fallback.
describe.each([
	['codex_for_jira_agent', 'blue'],
	['ai_mate_agent', 'blue'],
	['document_writer', 'blue'],
	['jira_task_planner_agent', 'blue'],
	['jira_delivery_agent', 'blue'],
	['jsm_service_triage_agent', 'yellow'],
] as const)('avatar alias %s', (agentNamedId, color) => {
	it('preserves ID-derived colours with the migration gate off', () => {
		failGate('rovo_agents_studio_use_agent_color');
		expect(getAgentColor({ agentNamedId, agentId: '1' })).toBe('purple');
	});

	it('uses the named colour with the migration gate on', () => {
		passGate('rovo_agents_studio_use_agent_color');
		expect(getAgentColor({ agentNamedId, agentId: '1' })).toBe(color);
		expect(getAgentColor({ agentNamedId })).toBe(color);
	});
});
