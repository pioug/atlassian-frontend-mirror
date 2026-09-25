import { token } from '@atlaskit/tokens';

import type { AgentBrandColorScheme, AgentPresenceColor } from './agent-presence-color-types';

const themed = (light: string, dark: string): string => `light-dark(${light}, ${dark})`;

const monochrome: AgentPresenceColor = {
	accentText: themed('#000000', '#E8E8EA'),
	background: themed('#E5E5E5', '#333335'),
	bold: themed('#000000', '#E8E8EA'),
	boldText: themed('#FFFFFF', '#292A2E'),
	border: themed('#BEB9B9', '#656567'),
	text: themed('#292A2E', '#E8E8EA'),
};

/** Brand values use the product's CSS colour scheme, so existing decorations follow theme changes. */
const brandColors: Readonly<Record<AgentBrandColorScheme, AgentPresenceColor>> = {
	'agent-brand-replit': {
		accentText: themed('#000000', '#E8E8EA'),
		background: themed('#E5E5E5', '#333335'),
		bold: themed('#000000', '#E8E8EA'),
		boldText: themed('#FFFFFF', '#000000'),
		border: themed('#BEB9B9', '#656567'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-lovable': {
		accentText: themed('#000000', '#E8E8EA'),
		background: themed('#E5E5E5', '#333335'),
		bold: themed('#000000', '#E8E8EA'),
		boldText: themed('#FFFFFF', '#000000'),
		border: themed('#BEB9B9', '#656567'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-figma': {
		accentText: themed('#000000', '#E8E8EA'),
		background: themed('#E5E5E5', '#333335'),
		bold: themed('#000000', '#E8E8EA'),
		boldText: themed('#FFFFFF', '#000000'),
		border: themed('#BEB9B9', '#656567'),
		emphasisBackground: themed('#E5E5E5', '#333335'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-databricks': {
		accentText: themed('#B52113', '#FF8C80'),
		background: themed('#FFEBE9', '#352525'),
		bold: themed('#FF3621', '#FF5F4D'),
		boldText: themed('#FFFFFF', '#292A2E'),
		border: themed('#FFBBB4', '#6D3530'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-amplitude': {
		accentText: themed('#0052F2', '#8FB9FF'),
		background: themed('#E5EEFE', '#242A37'),
		bold: themed('#0052F2', '#4C8DFF'),
		boldText: themed('#FFFFFF', '#000000'),
		border: themed('#B9D1FC', '#2F466F'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-slack': {
		accentText: themed('#611F69', '#E8E8EA'),
		background: themed('#EFE9F0', '#333335'),
		bold: themed('#611F69', '#E8E8EA'),
		boldText: themed('#FFFFFF', '#292A2E'),
		border: themed('#C892D1', '#656567'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-copilot': monochrome,
	'agent-brand-cortex': {
		accentText: themed('#25074D', '#AA8AD4'),
		background: themed('#E9E6ED', '#2D2A33'),
		bold: themed('#25074D', '#AA8AD4'),
		boldText: themed('#FFFFFF', '#292A2E'),
		border: themed('#AA8AD4', '#504460'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-manus': {
		accentText: themed('#34322D', '#C7C1B5'),
		background: themed('#EBEAEA', '#302F30'),
		bold: themed('#34322D', '#C7C1B5'),
		boldText: themed('#FFFFFF', '#292A2E'),
		border: themed('#B5AFAF', '#5A5855'),
		text: themed('#292A2E', '#E8E8EA'),
	},
	'agent-brand-gemini': monochrome,
	'agent-brand-antigravity': monochrome,
	/** ADS orange, the fixed telepointer/attribution slot Claude has always used. */
	'agent-brand-claude': {
		accentText: token('color.text.accent.orange'),
		background: token('color.background.accent.orange.subtlest'),
		bold: token('color.background.accent.orange.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.orange'),
		text: token('color.text'),
	},
	/** ADS purple, the fixed telepointer/attribution slot Rovo has always used. */
	'agent-brand-rovo': {
		accentText: token('color.text.accent.purple'),
		background: token('color.background.accent.purple.subtlest'),
		bold: token('color.background.accent.purple.bolder'),
		boldText: token('color.text.inverse'),
		border: token('color.border.accent.purple'),
		text: token('color.text'),
	},
	'agent-brand-chatgpt': {
		accentText: themed('#000000', '#E8E8EA'),
		background: themed('#E5E5E5', '#333335'),
		bold: themed('#000000', '#E8E8EA'),
		boldText: themed('#FFFFFF', '#000000'),
		border: themed('#BEB9B9', '#656567'),
		text: themed('#292A2E', '#E8E8EA'),
	},
};
export const agentBrandColorSchemes: Readonly<Record<AgentBrandColorScheme, AgentPresenceColor>> =
	Object.fromEntries(
		Object.entries(brandColors).map(([scheme, colors]) => [
			scheme,
			Object.fromEntries(
				Object.entries(colors).map(([role, value]) => [role, `var(--${scheme}-${role}, ${value})`]),
			),
		]),
	) as Record<AgentBrandColorScheme, AgentPresenceColor>;
