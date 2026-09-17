import { getAgentPresenceColor } from './get-agent-presence-color';
import { getThirdPartyAgentColor } from './get-third-party-agent-color';

describe('agent presence colours', () => {
	it('uses named identity before a conflicting display name', () => {
		expect(
			getThirdPartyAgentColor({ agentNamedId: 'mcp_amplitude_agent', agentName: 'Slack' })?.scheme,
		).toBe('agent-brand-amplitude');
	});

	it.each(['Lovable', 'Loveable', '  LOVABLE  '])(
		'accepts the legacy display-name alias %s',
		(agentName) => {
			expect(getThirdPartyAgentColor({ agentName })?.scheme).toBe('agent-brand-lovable');
		},
	);

	it.each(['constructor', '__proto__', 'toString'])(
		'ignores inherited object keys: %s',
		(agentName) => {
			expect(getThirdPartyAgentColor({ agentNamedId: agentName, agentName })).toBeUndefined();
		},
	);

	it('returns neutral fallback control to the consumer for an unknown brand', () => {
		expect(getThirdPartyAgentColor({ agentName: 'Custom integration' })).toBeUndefined();
	});

	it('provides both theme colours without reading the browser preference', () => {
		const matchMedia = jest.fn(() => {
			throw new Error('OS theme must not be read');
		});
		const original = window.matchMedia;
		window.matchMedia = matchMedia;
		try {
			expect(getThirdPartyAgentColor({ agentName: 'Databricks' })?.background).toBe(
				'var(--agent-brand-databricks-background, light-dark(#FFEBE9, #352525))',
			);
			expect(matchMedia).not.toHaveBeenCalled();
		} finally {
			window.matchMedia = original;
		}
	});

	it('uses designed white Databricks badge text in light mode', () => {
		expect(getThirdPartyAgentColor({ agentName: 'Databricks' })?.boldText).toBe(
			'var(--agent-brand-databricks-boldText, light-dark(#FFFFFF, #292A2E))',
		);
	});

	it('pairs Figma dark highlights with readable dark foreground', () => {
		expect(getThirdPartyAgentColor({ agentNamedId: 'mcp_figma_agent' })).toEqual(
			expect.objectContaining({
				background: 'var(--agent-brand-figma-background, light-dark(#E5E5E5, #E8E8EA))',
				text: 'var(--agent-brand-figma-text, light-dark(#292A2E, #292A2E))',
			}),
		);
	});

	it('shares the Studio palette for first-party agents', () => {
		expect(getAgentPresenceColor({ agentNamedId: 'planner_agent' })).toEqual(
			expect.objectContaining({
				scheme: 'purple',
				background: expect.stringContaining('purple-subtlest'),
			}),
		);
	});
});
