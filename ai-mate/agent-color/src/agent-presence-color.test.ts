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

	it.each(['Figma', 'Lovable', 'Replit'])('matches ChatGPT tag colours for %s', (agentName) => {
		const brand = getThirdPartyAgentColor({ agentName });
		expect(brand?.bold).toContain('light-dark(#000000, #E8E8EA)');
		expect(brand?.boldText).toContain('light-dark(#FFFFFF, #000000)');
	});

	it.each([
		['claude', 'agent-brand-claude', 'Claude'],
		['chatgpt', 'agent-brand-chatgpt', 'ChatGPT'],
		['rovo', 'agent-brand-rovo', 'Rovo'],
		['rovo_chat', 'agent-brand-rovo', 'Rovo'],
	])('resolves the %s alias to %s with display name %s', (agentName, scheme, name) => {
		expect(getThirdPartyAgentColor({ agentName })).toEqual(
			expect.objectContaining({ scheme, name }),
		);
	});

	it('normalises whitespace and casing for first-party brand aliases', () => {
		expect(getThirdPartyAgentColor({ agentName: '  ChatGPT  ' })?.scheme).toBe(
			'agent-brand-chatgpt',
		);
	});

	it('keeps the fixed ChatGPT brand colour, not an ADS token', () => {
		expect(getThirdPartyAgentColor({ agentName: 'chatgpt' })?.bold).toBe(
			'var(--agent-brand-chatgpt-bold, light-dark(#000000, #E8E8EA))',
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
