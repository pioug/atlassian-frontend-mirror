import {
  B100,
  B300,
  B400,
  B50,
  B75,
  DN50,
  DN70,
  N0,
  N100,
  N20,
  N30,
  N40,
  N50,
  N500,
  N700,
  N900,
  R300,
  R400,
  R50,
  R75,
} from '@atlaskit/theme/colors';
import {
  codeFontFamily,
  fontSize as defaultFontSize,
  gridSize,
  layers,
} from '@atlaskit/theme/constants';

import { EditorTheme } from './types';

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
export const akEditorSelectedBorderColor = B300;
export const akEditorSelectedBgColor = B50;
export const akEditorSelectedBlanketColor = B75;
export const akEditorSelectedBorderSize = 1;
export const akEditorSelectedBorder = `${akEditorSelectedBorderSize}px solid ${akEditorSelectedBorderColor}`;
export const akEditorSelectedBoxShadow = `0 0 0 ${akEditorSelectedBorderSize}px ${akEditorSelectedBorderColor}`;
export const akEditorSelectedIconColor = B400;
export const akEditorSelectedBorderBoldSize = 2;
export const akEditorSelectedBlanketOpacity = 0.3;
export const akEditorUnitZIndex = 1;
export const akEditorShadowZIndex = 2;
export const akEditorStickyHeaderZIndex = 11; // filmstrip uses 10 for its shadow
export const akEditorSmallZIndex = akEditorStickyHeaderZIndex + 1;
export const akEditorGridLineZIndex = 9999;
// z-index for main menu bar -
// this is highest as it should be above anything else in editor below.
export const akEditorMenuZIndex = layers.blanket();
// z-index used for floating toolbars like code block, table etc
export const akEditorFloatingPanelZIndex = layers.layer();
// z-index used for pickers (date, emoji, mentions) and type-aheads, hyperlinks
export const akEditorFloatingDialogZIndex = akEditorFloatingPanelZIndex + 10;
// z-index used for floating toolbars table cell menu which are above block toolbars
export const akEditorFloatingOverlapPanelZIndex =
  akEditorFloatingPanelZIndex + 5;
export const akEditorMentionSelected = N100;
export const akEditorTableToolbarSize = 11;
export const akEditorTableBorder = N50;
export const akEditorTableBorderDark = DN70;
export const akEditorTableToolbar = N20;
export const akEditorTableToolbarDark = DN50;
export const akEditorTableFloatingControls = N20;
export const akEditorTableCellSelected = B75;
export const akEditorTableToolbarSelected = B100;
export const akEditorTableBorderSelected = B300;
export const akEditorTableCellDelete = R50;
export const akEditorTableBorderDelete = R300;
export const akEditorTableToolbarDelete = R75;
export const akEditorTableBorderRadius = '3px';
export const akEditorTableCellBackgroundOpacity = 0.5;
export const akEditorFullPageMaxWidth = 680;
export const akEditorDefaultLayoutWidth = 760;
export const akEditorWideLayoutWidth = 960;
export const akEditorFullWidthLayoutWidth = 1800;
export const akEditorFullWidthLayoutLineLength = 1792;
export const akEditorTableNumberColumnWidth = 42;
export const akEditorBreakoutPadding = 96;
export const akEditorGutterPadding = 32;
export const akEditorMobileBreakoutPoint = 720;
export const akEditorTableCellMinWidth = 48;
export const akEditorTableLegacyCellMinWidth = 128;
export const akEditorMediaResizeHandlerPaddingWide = 12;
export const akEditorMediaResizeHandlerPadding = 4;
export const akEditorSwoopCubicBezier = `cubic-bezier(0.15, 1, 0.3, 1)`;
export const gridMediumMaxWidth = 1024;
export const breakoutWideScaleRatio = 1.33;
export const akRichMediaResizeZIndex = akEditorUnitZIndex * 99;
export const akLayoutGutterOffset = gridSize() * 1.5;
export const akEditorLineHeight = 1.714;
export const akEditorRuleBackground = N30;
export const akEditorRuleBorderRadius = '1px';
export const akEditorToolbarKeylineHeight = 2;
export const akEditorContextPanelWidth = 320;

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const blockNodesVerticalMargin = '0.75rem';

export const DEFAULT_EMBED_CARD_WIDTH = 680;
export const DEFAULT_EMBED_CARD_HEIGHT = 480;

export const ATLASSIAN_NAVIGATION_HEIGHT = '56px';

export const akEditorSelectedNodeClassName = 'ak-editor-selected-node';

export const editorFontSize = ({ theme }: { theme: EditorTheme }) =>
  theme && theme.baseFontSize ? theme.baseFontSize : defaultFontSize();

export const relativeSize = (multiplier: number) => ({
  theme,
}: {
  theme: EditorTheme;
}) => editorFontSize({ theme }) * multiplier;

export const relativeFontSizeToBase16 = (px: number | string) => {
  if (typeof px === 'string') {
    px = parseInt(px);
  }
  if (isNaN(px)) {
    throw new Error(`Invalid font size: '${px}'`);
  }
  return `${px / 16}rem`;
};

export const getAkEditorFullPageMaxWidth = (
  allowDynamicTextSizing: boolean = false,
) =>
  allowDynamicTextSizing
    ? akEditorFullPageMaxWidth
    : akEditorDefaultLayoutWidth;

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
  .map(([colorName, colorValue]) =>
    getTableCellBackgroundDarkModeColorCSS(colorName, colorValue),
  )
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
