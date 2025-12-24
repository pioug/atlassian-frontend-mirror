import { PanelType } from '@atlaskit/adf-schema';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';

const lightPanelColors = {
	info: '#DEEBFF',
	note: '#EAE6FF',
	tip: '#E3FCEF',
	success: '#E3FCEF',
	warning: '#FFFAE6',
	error: '#FFEBE6',
};

const prefix = 'ak-editor-panel';
export const PanelSharedCssClassName = {
	prefix,
	content: `${prefix}__content`,
	icon: `${prefix}__icon`,
	noIcon: `${prefix}__no-icon`,
};

export const PanelSharedSelectors = {
	infoPanel: `.${prefix}[data-panel-type=${PanelType.INFO}]`,
	notePanel: `.${prefix}[data-panel-type=${PanelType.NOTE}]`,
	warningPanel: `.${prefix}[data-panel-type=${PanelType.WARNING}]`,
	errorPanel: `.${prefix}[data-panel-type=${PanelType.ERROR}]`,
	successPanel: `.${prefix}[data-panel-type=${PanelType.SUCCESS}]`,
	noteButton: `button[aria-label="Note"]`,
	warningButton: `button[aria-label="Warning"]`,
	removeButton: `button[aria-label="Remove"]`,
	colorPalette: `[aria-label="Background color"]`,
	selectedColor: `[aria-label="Light green"]`,
	removeEmojiIcon: `[aria-label="Remove emoji"]`,
	emojiIcon: `[aria-label="editor-add-emoji"]`,
	selectedEmoji: `[aria-label=":grinning:"]`,
	addYourOwnEmoji: `#add-custom-emoji`,
	emojiNameInCustomEmoji: `[aria-label="Enter a name for the new emoji"]`,
	title: `#editor-title`,
	emojiPopup: `[aria-label="Popup"]`,
	searchEmoji: `[aria-label="Emoji name"]`,
	orangeWarningIcon: `[aria-label=":warning:"]`,
	yellowWarningIcon: `[aria-label=":warning:"]  span:nth-child(1)`,
	copyButton: `button[aria-label="Copy"]`,
};

// Provides the color without tokens, used when converting to a custom panel
export const getPanelTypeBackgroundNoTokens = (
	panelType: Exclude<PanelType, PanelType.CUSTOM>,
): string => lightPanelColors[panelType] || 'none';

export const getPanelTypeBackground = (panelType: Exclude<PanelType, PanelType.CUSTOM>): string =>
	hexToEditorBackgroundPaletteColor(lightPanelColors[panelType]) || 'none';
