import { fg } from '@atlaskit/platform-feature-flags';
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { token } from '@atlaskit/tokens';

import type { EditorTheme, ParticipantColor } from './types';

export const akEditorFullPageDefaultFontSize = 16;
export const akEditorCodeFontFamily = token('font.family.code');
export const akEditorSubtleAccent = token('color.background.accent.gray.subtler');
export const akEditorBlockquoteBorderColor = token('color.border');
export const akEditorCodeBackground = token('color.background.accent.gray.subtlest');
export const akEditorCodeBlockPadding = '12px';
export const akEditorCodeInlinePadding = '2px 4px';
export const akEditorDeleteBackground = token('color.background.danger');
export const akEditorDeleteBackgroundWithOpacity = 'rgba(255, 189, 173, 0.5)'; // R75 with 50% opacity
export const akEditorDeleteBorder = token('color.border.danger');
export const akEditorDeleteIconColor = token('color.icon.danger');
export const akEditorCustomIconSize = 20;
export const akEditorSelectedBorderColor = token('color.border.selected');
export const akEditorSelectedBorderSize = 1;
export const akEditorSelectedBorder = `${akEditorSelectedBorderSize}px solid ${token(
	'color.border.selected',
)}`;
export const akEditorSelectedBoxShadow = `0 0 0 ${akEditorSelectedBorderSize}px ${token(
	'color.border.selected',
)}`;
export const akEditorSelectedBorderBoldSize = 2;
export const akEditorSelectedBlanketOpacity = 0.3;
export const akEditorUnitZIndex = 1;
export const akEditorShadowZIndex = 2;
export const akEditorStickyHeaderZIndex = 11; // filmstrip uses 10 for its shadow
export const akEditorSmallZIndex = akEditorStickyHeaderZIndex + 1;
export const akEditorGridLineZIndex = 2;
// z-index for main menu bar -
// this is highest as it should be above anything else in editor below.
export const akEditorMenuZIndex = 500;
// z-index used for floating toolbars like code block, table etc
export const akEditorFloatingPanelZIndex = 400;
// z-index used for pickers (date, emoji, mentions) and type-aheads, hyperlinks
export const akEditorFloatingDialogZIndex = akEditorMenuZIndex + 10;
// z-index used for table cell menu options button on a sticky header
export const akEditorTableCellOnStickyHeaderZIndex = akEditorFloatingDialogZIndex - 5;
// z-index used for floating toolbars table cell menu which are above block toolbars
export const akEditorFloatingOverlapPanelZIndex = akEditorFloatingPanelZIndex + 5;
export const akEditorTableToolbarSize = 11;
export const akEditorTableBorder = token('color.background.accent.gray.subtler');
export const akEditorTableToolbar = token('color.background.accent.gray.subtlest');
export const akEditorTableHeaderCellBackground = '#F1F2F4';
export const akEditorTableHeaderCellBackgroundDark = '#2C333A';
export const akEditorTableBorderSelected = token('color.border.focused');
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
	fg('platform.editor.core.increase-full-page-guttering') ? 52 : 32;
export const akEditorMobileBreakoutPoint = 720;
export const akEditorTableCellMinWidth = 48;
export const akEditorTableLegacyCellMinWidth = 128;
export const akEditorMediaResizeHandlerPaddingWide = 12;
export const akEditorMediaResizeHandlerPadding = 4;
export const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
export const gridMediumMaxWidth = 1024;
export const breakoutWideScaleRatio = 1.33;
export const akEditorCalculatedWideLayoutWidthSmallViewport = 905; // from breakoutConsts.calcWideWidth, layoutMaxWidth * breakoutConsts.wideScaleRatio = 904.8 ~ 905 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is <= 1266px.
export const akEditorCalculatedWideLayoutWidth = 1011; // = akEditorDefaultLayoutWidth * breakoutWideScaleRatio = 1010.8 ~ 1011 This is a resulting width value that is applied to nodes that currently use breakouts (except table) and are set to `wide` when the viewport's width is > 1329px.
export const akRichMediaResizeZIndex = akEditorUnitZIndex * 99;
export const akLayoutGutterOffset = 12;
export const akEditorLineHeight = 1.714;
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

const DEFAULT_FONT_SIZE = 14;

export const FULL_PAGE_EDITOR_TOOLBAR_HEIGHT = () =>
	fg('platform.confluence.frontend.narrow-full-page-editor-toolbar')
		? token('space.500', '40px')
		: '56px';

export const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const editorFontSize = ({ theme }: { theme: { baseFontSize?: number } | undefined }) =>
	theme && theme.baseFontSize ? theme.baseFontSize : DEFAULT_FONT_SIZE;

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
	token('color.icon.accent.red'),
	token('color.background.accent.red.bolder.hovered'),
	token('color.icon.accent.magenta'),
	token('color.background.accent.magenta.bolder.hovered'),
	token('color.icon.accent.orange'),
	token('color.background.accent.orange.bolder.hovered'),
	token('color.icon.accent.green'),
	token('color.background.accent.green.bolder.hovered'),
	token('color.icon.accent.blue'),
	token('color.background.accent.blue.bolder.hovered'),
	token('color.icon.accent.teal'),
	token('color.background.accent.teal.bolder.hovered'),
	token('color.icon.accent.lime'),
	token('color.background.accent.lime.bolder.hovered'),
	token('color.icon.accent.purple'),
	token('color.background.accent.purple.bolder.hovered'),
	token('color.icon.accent.gray'),
	token('color.background.accent.gray.bolder.hovered'),
	token('color.icon.accent.yellow'),
	token('color.background.accent.yellow.bolder.hovered'),
	token('color.background.accent.yellow.bolder.pressed'),
];

// MDS-569: Will update references to avatarColors to use participantColors instead, we will then deprecate avatarColors
export const participantColors: Array<ParticipantColor> = [
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.red.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.blue.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.green.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.yellow.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.purple.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.magenta.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.teal.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.orange.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.lime.bolder'),
	},
	{
		textColor: token('color.text.inverse'),
		backgroundColor: token('color.background.accent.gray.bolder'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.blue.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.red.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.orange.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.yellow.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.green.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.teal.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.purple.subtle'),
	},
	{
		textColor: token('color.text.accent.gray.bolder'),
		backgroundColor: token('color.background.accent.magenta.subtle'),
	},
];
