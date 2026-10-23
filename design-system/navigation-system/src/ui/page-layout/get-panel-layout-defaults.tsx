import { fg } from '@atlaskit/platform-feature-flags/fg';

const DEFAULT_PANEL_WIDTH = 365;
const DEFAULT_PANEL_WIDTH_WITH_CHAT_PANEL_LAYOUT = 400;

/**
 * Local-panel defaults in pixels, used only when no explicit preference exists.
 * Keep the existing desktop width until chat layout rolls out. Compact sizing is independent.
 * These are requested defaults, not measurements of an open panel.
 */
export function getPanelLayoutDefaults(): {
	panelWidth: number;
	compactPanelWidth: number;
	panelMinWidth: number;
} {
	return {
		panelWidth: fg('platform-dst-chat-panel-layout')
			? DEFAULT_PANEL_WIDTH_WITH_CHAT_PANEL_LAYOUT
			: DEFAULT_PANEL_WIDTH,
		compactPanelWidth: 320,
		panelMinWidth: 320,
	};
}
