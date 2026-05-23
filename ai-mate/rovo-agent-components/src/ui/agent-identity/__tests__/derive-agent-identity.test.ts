import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { deriveAgentIdentity } from '../derive-agent-identity';

describe('deriveAgentIdentity', () => {
	const baseInput = { defaultName: 'Rovo' };

	describe('default Rovo path (no agentId)', () => {
		it('falls back to defaultName for both visible and accessible labels', () => {
			expect.hasAssertions();
			const result = deriveAgentIdentity(baseInput);
			expect(result.specialistAgentId).toBeUndefined();
			expect(result.visibleName).toBe('Rovo');
			expect(result.accessibleName).toBe('Rovo');
			expect(result.avatarProps.agentId).toBeUndefined();
		});

		it('treats empty / whitespace agentId as no specialist', () => {
			expect.hasAssertions();
			expect(deriveAgentIdentity({ ...baseInput, agentId: '' }).specialistAgentId).toBeUndefined();
			expect(
				deriveAgentIdentity({ ...baseInput, agentId: '   ' }).specialistAgentId,
			).toBeUndefined();
		});
	});

	describe('specialist path (agentId set)', () => {
		it('uses agentName when supplied', () => {
			expect.hasAssertions();
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				agentName: 'Release notes agent',
			});
			expect(result.specialistAgentId).toBe('agent-1');
			expect(result.visibleName).toBe('Release notes agent');
			expect(result.accessibleName).toBe('Release notes agent');
		});

		it('trims whitespace-padded agentId so neither avatar nor label leak whitespace', () => {
			expect.hasAssertions();
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: '  agent-123  ',
			});
			expect(result.specialistAgentId).toBe('agent-123');
			expect(result.avatarProps.agentId).toBe('agent-123');
			expect(result.accessibleName).toBe('agent-123');
		});

		it('treats whitespace-only agentName as missing (no whitespace label)', () => {
			expect.hasAssertions();
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				agentName: '   ',
			});
			expect(result.visibleName).toBeUndefined();
			expect(result.accessibleName).toBe('agent-1');
		});

		it('omits visibleName but uses agentId for accessibleName when agentName missing', () => {
			expect.hasAssertions();
			const result = deriveAgentIdentity({ ...baseInput, agentId: 'agent-1' });
			expect(result.visibleName).toBeUndefined();
			expect(result.accessibleName).toBe('agent-1');
		});
	});

	describe('Forge gating via rovo_agent_support_a2a_avatar', () => {
		it('passes Forge props through when the gate is on', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				isForgeAgent: true,
				forgeAgentIconUrl: 'https://example/icon.png',
			});
			expect(result.avatarProps.isForgeAgent).toBe(true);
			expect(result.avatarProps.forgeAgentIconUrl).toBe('https://example/icon.png');
		});

		it('drops Forge props when the gate is off', () => {
			expect.hasAssertions();
			failGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				isForgeAgent: true,
				forgeAgentIconUrl: 'https://example/icon.png',
			});
			expect(result.avatarProps.isForgeAgent).toBeUndefined();
			expect(result.avatarProps.forgeAgentIconUrl).toBeUndefined();
		});

		it('resolves isForgeAgent from raw FORGE creatorType', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				creatorType: 'FORGE',
			});
			expect(result.avatarProps.isForgeAgent).toBe(true);
		});

		it('resolves isForgeAgent from raw REMOTE_A2A creatorType', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				creatorType: 'REMOTE_A2A',
			});
			expect(result.avatarProps.isForgeAgent).toBe(true);
		});

		it('returns false for non-Forge creatorType (e.g. SYSTEM)', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				creatorType: 'SYSTEM',
			});
			expect(result.avatarProps.isForgeAgent).toBe(false);
		});

		it('returns undefined when creatorType is unknown (not in AgentCreatorType union)', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				creatorType: 'TOTALLY_UNKNOWN',
			});
			expect(result.avatarProps.isForgeAgent).toBeUndefined();
		});

		it('isForgeAgent override takes precedence over creatorType', () => {
			expect.hasAssertions();
			passGate('rovo_agent_support_a2a_avatar');
			const result = deriveAgentIdentity({
				...baseInput,
				agentId: 'agent-1',
				creatorType: 'FORGE',
				isForgeAgent: false,
			});
			expect(result.avatarProps.isForgeAgent).toBe(false);
		});
	});

	it('forwards agentNamedId, agentIdentityAccountId and imageUrl unchanged', () => {
		expect.hasAssertions();
		const result = deriveAgentIdentity({
			...baseInput,
			agentId: 'agent-1',
			agentNamedId: 'release_notes_agent',
			agentIdentityAccountId: 'acct-1',
			imageUrl: 'https://example/avatar.png',
		});
		expect(result.avatarProps.agentNamedId).toBe('release_notes_agent');
		expect(result.avatarProps.agentIdentityAccountId).toBe('acct-1');
		expect(result.avatarProps.imageUrl).toBe('https://example/avatar.png');
	});
});
