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

export const darkPanelColors = {
	// standard panels
	info: `#0C294F`,
	error: `#441C13`,
	warning: `#413001`,
	tip: `#052E21`,
	success: `#052E21`,
	note: `#282249`,

	// Reds
	R900: '#601D16',

	// Red Saturated
	R100S: `#FFEFEB`,
	R300S: `#FFB5A3`,
	R500S: `#FF6B47`,
	R800S: `#C4320E`,
	R1200S: `#441C13`,

	// Yellows
	Y900: '#533F04',

	// Yellow Saturated
	Y100S: `#FFF3D1`,
	Y300S: `#FFDC7A`,
	Y500S: `#FFC933`,
	Y800S: `#D8A003`,
	Y1200S: `#413001`,

	// Greens
	G900: '#164B35',

	// Green Saturated
	G100S: `#E3FCF0`,
	G300S: `#95EEC5`,
	G400S: `#60DCA8`,
	G900S: `#086848`,
	G1200S: `#052E21`,

	// Blues
	B900: '#09326C',

	// Saturated Blues
	B100S: '#E5F0FF',
	B300S: '#A3C9FF',
	B500S: '#4794FF',
	B800S: '#0055CC',
	B1200S: '#0C294F',

	// Purples
	P900: `#352C63`,

	// Purple Saturated
	P100S: `#EEEBFF`,
	P300S: `#CCC3FE`,
	P500S: `#A292F7`,
	P800S: `#5E49CA`,
	P1200S: `#282249`,

	// Teals
	T900: '#1D474C',

	// Teal Saturated
	T100S: `#DBFAFF`,
	T300S: `#78EBFC`,
	T400S: `#3AD6EE`,
	T900S: `#056270`,
	T1200S: `#0B3037`,

	// Dark Mode Alpha
	DarkGray: '#161A1D',
	Gray: '#2C333A',
	LightGray: '#5A6977',

	TextColor: '#D9DDE3',
};

export function getPanelDarkModeCSS(colorName: string, colorValue: string): string {
	return `
  &[data-panel-color="${colorName}"] {
    background-color: ${colorValue} !important; // !important to override default style color
    color: ${darkPanelColors.TextColor};
  }
  `;
}

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
