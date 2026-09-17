import type { AgentColor } from './get-agent-color';

export type AgentPresenceColor = {
	accentText: string;
	background: string;
	bold: string;
	boldText: string;
	border: string;
	emphasisBackground?: string;
	text: string;
};

export type AgentBrandColorScheme =
	| 'agent-brand-replit'
	| 'agent-brand-lovable'
	| 'agent-brand-figma'
	| 'agent-brand-databricks'
	| 'agent-brand-amplitude'
	| 'agent-brand-slack'
	| 'agent-brand-copilot'
	| 'agent-brand-cortex'
	| 'agent-brand-manus'
	| 'agent-brand-gemini'
	| 'agent-brand-antigravity';

export type AgentPresenceColorScheme = AgentColor | AgentBrandColorScheme;
