import {
  codeFontFamily,
  layers,
  colors,
  fontSize as defaultFontSize,
  gridSize,
} from '@atlaskit/theme';

const {
  B100,
  B300,
  B400,
  B50,
  B75,
  N0,
  N20,
  N40,
  N50,
  N100,
  N500,
  N700,
  N900,
  R300,
  R400,
  R50,
  R75,
  DN50,
  DN70,
} = colors;

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
export const akEditorDeleteBorder = R300;
export const akEditorDeleteIconColor = R400;
export const akEditorSelectedBorder = B300;
export const akEditorSelectedIconColor = B400;
export const akEditorSelectedBorderSize = 1;
export const akEditorSelectedBorderBoldSize = 2;
export const akEditorUnitZIndex = 1;
export const akEditorSmallZIndex = 2;
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
export const akEditorDefaultLayoutWidth = 680;
export const akEditorWideLayoutWidth = 960;
export const akEditorFullWidthLayoutWidth = 1800;
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
export const akMediaSingleResizeZIndex = akEditorUnitZIndex * 99;
export const akLayoutGutterOffset = gridSize() * 1.5;

export type EditorTheme = {
  baseFontSize?: number;
};

export const editorFontSize = ({ theme }: { theme: EditorTheme }) =>
  theme && theme.baseFontSize ? theme.baseFontSize : defaultFontSize();

export const relativeSize = (multiplier: number) => ({
  theme,
}: {
  theme: EditorTheme;
}) => editorFontSize({ theme }) * multiplier;

// @see typography spreadsheet: https://docs.google.com/spreadsheets/d/1iYusRGCT4PoPfvxbJ8NrgjtfFgXLm5lpDWXzjua1W2E/edit#gid=93913128
export const blockNodesVerticalMargin = '1.143rem';
