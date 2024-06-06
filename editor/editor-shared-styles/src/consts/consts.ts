import { getBooleanFF } from '@atlaskit/platform-feature-flags';
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import {
	B100,
	B300,
	B400,
	B50,
	B500,
	B75,
	DN50,
	DN70,
	G100,
	G300,
	G500,
	N0,
	N100,
	N20,
	N200,
	N30,
	N40,
	N50,
	N500,
	N70,
	N700,
	N800,
	N900,
	P100,
	P300,
	P500,
	R100,
	R300,
	R400,
	R50,
	R500,
	R75,
	T100,
	T300,
	T500,
	Y100,
	Y300,
	Y500,
} from '@atlaskit/theme/colors';
import {
	codeFontFamily,
	fontSize as defaultFontSize,
	// eslint-disable-next-line @atlaskit/design-system/no-deprecated-imports
	gridSize,
	layers,
} from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import type { EditorTheme } from './types';

export const akEditorFullPageDefaultFontSize = 16;
export const akEditorCodeFontFamily = codeFontFamily();
export const akEditorInactiveForeground = N500;
export const akEditorFocus = B100;
export const akEditorSubtleAccent = N40;
export const akEditorActiveBackground = N500;
export const akEditorActiveForeground = N0;
export const akEditorBlockquoteBorderColor = N40;
export const akEditorDropdownActiveBackground = N900;
export const akEditorPopupBackground = N700;
export const akEditorPopupText = B50;
export const akEditorPrimaryButton = B400;
export const akEditorCodeBackground = N20;
export const akEditorCodeBlockPadding = '12px';
export const akEditorCodeInlinePadding = '2px 4px';
export const akEditorDeleteBackground = R50;
export const akEditorDeleteBackgroundShaded = R50;
export const akEditorDeleteBackgroundWithOpacity = 'rgba(255, 189, 173, 0.5)'; // R75 with 50% opacity
export const akEditorDeleteBorder = R300;
export const akEditorDeleteIconColor = R400;
export const akEditorCustomIconSize = 20;
export const akEditorSelectedBorderColor = B300;
export const akEditorSelectedBgColor = B50;
export const akEditorSelectedBlanketColor = B75;
export const akEditorSelectedBorderSize = 1;
export const akEditorSelectedBorder = `${akEditorSelectedBorderSize}px solid ${token(
	'color.border.selected',
	akEditorSelectedBorderColor,
)}`;
export const akEditorSelectedBoxShadow = `0 0 0 ${akEditorSelectedBorderSize}px ${token(
	'color.border.selected',
	akEditorSelectedBorderColor,
)}`;
export const akEditorSelectedIconColor = B400;
export const akEditorSelectedBorderBoldSize = 2;
export const akEditorSelectedBlanketOpacity = 0.3;
export const akEditorUnitZIndex = 1;
export const akEditorShadowZIndex = 2;
export const akEditorStickyHeaderZIndex = 11; // filmstrip uses 10 for its shadow
export const akEditorSmallZIndex = akEditorStickyHeaderZIndex + 1;
export const akEditorGridLineZIndex = 1;
// z-index for main menu bar -
// this is highest as it should be above anything else in editor below.
export const akEditorMenuZIndex = layers.blanket();
// z-index used for floating toolbars like code block, table etc
export const akEditorFloatingPanelZIndex = layers.layer();
// z-index used for pickers (date, emoji, mentions) and type-aheads, hyperlinks
export const akEditorFloatingDialogZIndex = akEditorMenuZIndex + 10;
// z-index used for table cell menu options button on a sticky header
export const akEditorTableCellOnStickyHeaderZIndex = akEditorFloatingDialogZIndex - 5;
// z-index used for floating toolbars table cell menu which are above block toolbars
export const akEditorFloatingOverlapPanelZIndex = akEditorFloatingPanelZIndex + 5;
export const akEditorMentionSelected = N100;
export const akEditorTableToolbarSize = 11;
export const akEditorTableBorder = N50;
export const akEditorTableBorderDark = DN70;
export const akEditorTableToolbar = N20;
export const akEditorTableToolbarDark = DN50;
export const akEditorTableFloatingControls = N20;
export const akEditorTableCellSelected = B75;
export const akEditorTableHeaderCellBackground = '#F1F2F4';
export const akEditorTableHeaderCellBackgroundDark = '#2C333A';
export const akEditorTableToolbarSelected = B100;
export const akEditorTableBorderSelected = B300;
export const akEditorTableCellDelete = R50;
export const akEditorTableBorderDelete = R300;
export const akEditorTableToolbarDelete = R75;
export const akEditorTableBorderRadius = '3px';
export const akEditorTableCellBackgroundOpacity = 0.5;
export const akEditorFullPageMaxWidth = 680;
export const akEditorDefaultLayoutWidth = 760;
export const akEditorWideLayoutWidth = 960; // This value is used for tables with breakouts and is used to calculate `breakoutWidthPx`
export const akEditorFullWidthLayoutWidth = 1800;
export const akEditorFullWidthLayoutLineLength = 1792;
export const akEditorTableNumberColumnWidth = 42;
export const akEditorBreakoutPadding = 96;
export const akEditorGutterPadding = 32;
export const akEditorGutterPaddingDynamic = () =>
	getBooleanFF('platform.editor.core.increase-full-page-guttering') ? 52 : 32;
export const akEditorMobileBreakoutPoint = 720;
export const akEditorTableCellMinWidth = 48;
export const akEditorTableLegacyCellMinWidth = 128;
export const akEditorMediaResizeHandlerPaddingWide = 12;
export const akEditorMediaResizeHandlerPadding = 4;
export const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
export const gridMediumMaxWidth = 1024;
export const breakoutWideScaleRatio = 1.33;
export const akEditorCalculatedWideLayoutWidth = 1011; // = akEditorDefaultLayoutWidth * breakoutWideScaleRatio = 1010.8 ~ 1011 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is > 1329px.
export const akRichMediaResizeZIndex = akEditorUnitZIndex * 99;
export const akLayoutGutterOffset = gridSize() * 1.5;
export const akEditorLineHeight = 1.714;
export const akEditorRuleBackground = N30;
export const akEditorRuleBorderRadius = '1px';
export const akEditorToolbarKeylineHeight = 2;
export const akEditorContextPanelWidth = 320;
export const akEditorTableCellBlanketSelected = 'rgba(179, 212, 255, 0.3)';
export const akEditorTableCellBlanketDeleted = 'rgba(255, 235, 230, 0.3)';

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const blockNodesVerticalMargin = '0.75rem';

export const DEFAULT_EMBED_CARD_WIDTH = 680;
export const DEFAULT_EMBED_CARD_HEIGHT = 480;

export const MAX_BROWSER_SCROLLBAR_HEIGHT = 20;

// @deprecated
export const ATLASSIAN_NAVIGATION_HEIGHT = '56px';

export const FULL_PAGE_EDITOR_TOOLBAR_HEIGHT = () =>
	getBooleanFF('platform.confluence.frontend.narrow-full-page-editor-toolbar')
		? token('space.500', '40px')
		: '56px';

export const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const editorFontSize = ({ theme }: { theme: EditorTheme }) =>
	theme && theme.baseFontSize ? theme.baseFontSize : defaultFontSize();

export const relativeSize =
	(multiplier: number) =>
	({ theme }: { theme: EditorTheme }) =>
		editorFontSize({ theme }) * multiplier;

export const relativeFontSizeToBase16 = (px: number | string) => {
	if (typeof px === 'string') {
		px = parseInt(px);
	}
	if (isNaN(px)) {
		throw new Error(`Invalid font size: '${px}'`);
	}
	return `${px / 16}rem`;
};

export const VIEWPORT_SIZES = {
	laptopHiDPI: { width: 1440, height: 900 },
	laptopMDPI: { width: 1280, height: 800 },
	tabletL: { width: 1024, height: 1366 },
	tabletS: { width: 768, height: 1024 },
	mobileM: { width: 414, height: 736 },
	mobileS: { width: 375, height: 667 },
	mobileXS: { width: 320, height: 568 },
};

// to be updated in ED-10790: this should be variable threshold based on how many buttons enabled on main toolbar
export const akEditorMobileMaxWidth = 0;

export const getTableCellBackgroundDarkModeColors = [
	['White', '#000000'],
	['Light blue', '#0C294F'],
	['Light teal', '#0C343B'],
	['Light green', '#052E21'],
	['Light yellow', '#484123'],
	['Light red', '#441C13'],
	['Light purple', '#282249'],

	['Light gray', '#202328'],
	['Blue', '#0B3165'],
	['Teal', '#044853'],
	['Green', '#053927'],
	['Yellow', '#6F5C25'],
	['Red', '#582013'],
	['Purple', '#3E327B'],

	['Gray', '#475262'],
	['Dark blue', '#003884'],
	['Dark teal', '#055866'],
	['Dark green', '#044932'],
	['Dark yellow', '#82641C'],
	['Dark red', '#6B2A19'],
	['Dark purple', '#4D38B2'],
]
	.map(([colorName, colorValue]) => getTableCellBackgroundDarkModeColorCSS(colorName, colorValue))
	.join('\n');

export function getTableCellBackgroundDarkModeColorCSS(
	colorName: string,
	colorValue: string,
): string {
	return `
  &[colorname="${colorName}"] {
    background-color: ${colorValue} !important; // !important to override default style color
  }
  `;
}

export const avatarColors = [
	token('color.icon.accent.red', R100),
	token('color.background.accent.red.bolder.hovered', R300),
	token('color.icon.accent.magenta', R500),
	token('color.background.accent.magenta.bolder.hovered', Y100),
	token('color.icon.accent.orange', Y300),
	token('color.background.accent.orange.bolder.hovered', Y500),
	token('color.icon.accent.green', G100),
	token('color.background.accent.green.bolder.hovered', G300),
	token('color.icon.accent.blue', G500),
	token('color.background.accent.blue.bolder.hovered', T100),
	token('color.icon.accent.teal', T300),
	token('color.background.accent.teal.bolder.hovered', T500),
	token('color.icon.accent.lime', B100),
	token('color.background.accent.lime.bolder.hovered', B300),
	token('color.icon.accent.purple', B500),
	token('color.background.accent.purple.bolder.hovered', N70),
	token('color.icon.accent.gray', N200),
	token('color.background.accent.gray.bolder.hovered', N800),
	token('color.icon.accent.yellow', P100),
	token('color.background.accent.yellow.bolder.hovered', P300),
	token('color.background.accent.yellow.bolder.pressed', P500),
];
