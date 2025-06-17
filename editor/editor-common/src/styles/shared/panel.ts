/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { PanelType } from '@atlaskit/adf-schema';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import {
	akEditorTableCellMinWidth,
	blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { emojiImage, emojiSprite } from '@atlaskit/emoji';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

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

const lightIconColor = {
	info: token('color.icon.information'),
	note: token('color.icon.discovery'),
	tip: token('color.icon.success'),
	success: token('color.icon.success'),
	warning: token('color.icon.warning'),
	error: token('color.icon.danger'),
};

// New custom icons are a little smaller than predefined icons.
// To fix alignment issues with custom icons, vertical alignment is updated.
const panelEmojiSpriteVerticalAlignment = -(8 * 3 - akEditorCustomIconSize) / 2;
const panelEmojiImageVerticalAlignment = panelEmojiSpriteVerticalAlignment - 1;

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

const getIconStyles = (panelType: Exclude<PanelType, PanelType.CUSTOM>) => {
	return `
		.${PanelSharedCssClassName.icon}[data-panel-type='${panelType}'] {
			color: ${lightIconColor[panelType]};
		}
	`;
};

// Provides the color without tokens, used when converting to a custom panel
export const getPanelTypeBackgroundNoTokens = (
	panelType: Exclude<PanelType, PanelType.CUSTOM>,
): string => lightPanelColors[panelType] || 'none';

export const getPanelTypeBackground = (panelType: Exclude<PanelType, PanelType.CUSTOM>): string =>
	hexToEditorBackgroundPaletteColor(lightPanelColors[panelType]) || 'none';

const mainDynamicStyles = (panelType: Exclude<PanelType, PanelType.CUSTOM>) => {
	return `
    background-color: ${getPanelTypeBackground(panelType)};
    color: inherit;
  `;
};

// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- Safe to autofix with a tiny tweak to `mainDynamicStyles` being an object, but holding off…
export const panelSharedStylesWithoutPrefix = () => css`
	border-radius: ${token('border.radius', '3px')};
	margin: ${blockNodesVerticalMargin} 0 0;
	padding-top: ${token('space.100', '8px')};
	padding-right: ${token('space.200', '16px')};
	padding-bottom: ${token('space.100', '8px')};
	padding-left: ${token('space.100', '8px')};
	min-width: ${akEditorTableCellMinWidth}px;
	display: flex;
	position: relative;
	align-items: normal;
	word-break: break-word;

	${mainDynamicStyles(PanelType.INFO)}

	.${PanelSharedCssClassName.icon} {
		flex-shrink: 0;
		height: ${token('space.300', '24px')};
		width: ${token('space.300', '24px')};
		box-sizing: content-box;
		padding-right: ${token('space.100', '8px')};
		text-align: center;
		user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		margin-top: 0.1em;

		> span {
			vertical-align: middle;
			display: inline-flex;
		}

		.${emojiSprite} {
			vertical-align: ${panelEmojiSpriteVerticalAlignment}px;
		}

		.${emojiImage} {
			vertical-align: ${panelEmojiImageVerticalAlignment}px;

			/* Vertical align only works for inline-block elements in Firefox */
			@-moz-document url-prefix() {
				img {
					display: inline-block;
				}
			}
		}
	}

	.ak-editor-panel__content {
		margin: ${token('space.025', '2px')} 0 ${token('space.025', '2px')};
		flex: 1 0 0;
		/*
      https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
      The default value for min-width is auto, which is computed to zero. When an element is a flex item, the value of min-width doesn’t compute to zero. The minimum size of a flex item is equal to the size of its contents.
    */
		min-width: 0;
	}

	/* support nested panel */
	${fg('platform_editor_add_border_for_nested_panel')
		? `.${PanelSharedCssClassName.content} .${prefix} {
			border: 1px solid ${token('color.border', '#091E42')};
		}`
		: ''}

	&[data-panel-type='${PanelType.INFO}'] {
		${getIconStyles(PanelType.INFO)}
	}

	&[data-panel-type='${PanelType.NOTE}'] {
		${mainDynamicStyles(PanelType.NOTE)}
		${getIconStyles(PanelType.NOTE)}
	}

	&[data-panel-type='${PanelType.TIP}'] {
		${mainDynamicStyles(PanelType.TIP)}
		${getIconStyles(PanelType.TIP)}
	}

	&[data-panel-type='${PanelType.WARNING}'] {
		${mainDynamicStyles(PanelType.WARNING)}
		${getIconStyles(PanelType.WARNING)}
	}

	&[data-panel-type='${PanelType.ERROR}'] {
		${mainDynamicStyles(PanelType.ERROR)}
		${getIconStyles(PanelType.ERROR)}
	}

	&[data-panel-type='${PanelType.SUCCESS}'] {
		${mainDynamicStyles(PanelType.SUCCESS)}
		${getIconStyles(PanelType.SUCCESS)}
	}

	${fg('platform_editor_nested_dnd_styles_changes')
		? `&.${PanelSharedCssClassName.noIcon} {
			padding-right: ${token('space.150', '12px')};
			padding-left: ${token('space.150', '12px')};
		}`
		: ''}
`;

export const panelSharedStyles = () =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`.${PanelSharedCssClassName.prefix}`]: panelSharedStylesWithoutPrefix(),
	});
