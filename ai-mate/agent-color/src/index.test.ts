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
	});

	it('defaults to yellow when there is no hexadecimal identity', () => {
		expect(getAgentColor({ agentId: 'zzzzzzzz' })).toBe('yellow');
	});
});
