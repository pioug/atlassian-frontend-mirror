import { agentBrandColorSchemes } from './agent-brand-color-schemes';
import type { AgentBrandColorScheme, AgentPresenceColor } from './agent-presence-color-types';

const namedBrands: Record<string, AgentBrandColorScheme | undefined> = {
	mcp_amplitude_agent: 'agent-brand-amplitude',
	mcp_figma_agent: 'agent-brand-figma',
	mcp_lovable_agent: 'agent-brand-lovable',
	mcp_replit_agent: 'agent-brand-replit',
};

const displayNameBrands: Record<string, AgentBrandColorScheme | undefined> = {
	amplitude: 'agent-brand-amplitude',
	antigravity: 'agent-brand-antigravity',
	copilot: 'agent-brand-copilot',
	cortex: 'agent-brand-cortex',
	databricks: 'agent-brand-databricks',
	figma: 'agent-brand-figma',
	gemini: 'agent-brand-gemini',
	lovable: 'agent-brand-lovable',
	loveable: 'agent-brand-lovable',
	manus: 'agent-brand-manus',
	replit: 'agent-brand-replit',
	slack: 'agent-brand-slack',
};

/**
 * Known named IDs survive display-name changes. Other brands retain the legacy exact-name
 * fallback until stable metadata is available; callers own third-party classification.
 */
export const getThirdPartyAgentColor = ({
	agentNamedId,
	agentName,
}: {
	agentName?: string;
	agentNamedId?: string | null;
}): (AgentPresenceColor & { scheme: AgentBrandColorScheme }) | undefined => {
	const namedId = agentNamedId ?? '';
	const displayName = agentName?.trim().toLowerCase() ?? '';
	const namedScheme = Object.prototype.hasOwnProperty.call(namedBrands, namedId)
		? namedBrands[namedId]
		: undefined;
	const displayScheme = Object.prototype.hasOwnProperty.call(displayNameBrands, displayName)
		? displayNameBrands[displayName]
		: undefined;
	const scheme = namedScheme ?? displayScheme;
	return scheme ? { ...agentBrandColorSchemes[scheme], scheme } : undefined;
};
