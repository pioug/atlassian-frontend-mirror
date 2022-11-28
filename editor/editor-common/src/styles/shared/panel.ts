/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */

// TODO: https://product-fabric.atlassian.net/browse/DSP-4066

import { css } from '@emotion/react';

import { PanelType } from '@atlaskit/adf-schema';
import {
  akEditorTableCellMinWidth,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { emojiImage, emojiSprite } from '@atlaskit/emoji';
import * as colors from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { ThemeProps } from '@atlaskit/theme/types';

const lightPanelColor = {
  info: colors.B50,
  note: colors.P50,
  tip: colors.G50,
  success: colors.G50,
  warning: colors.Y50,
  error: colors.R50,
};

export const darkPanelColors = {
  // standard panels
  info: '#0C294F',
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
  info: colors.B400,
  note: colors.P400,
  tip: colors.G400,
  success: colors.G400,
  warning: colors.Y400,
  error: colors.R400,
};

const darkIconColor = {
  info: colors.B100,
  note: colors.P100,
  tip: colors.G200,
  success: colors.G200,
  warning: colors.Y100,
  error: colors.R200,
};

// New custom icons are a little smaller than predefined icons.
// To fix alignment issues with custom icons, vertical alignment is updated.
const panelEmojiSpriteVerticalAlignment =
  -(gridSize() * 3 - akEditorCustomIconSize) / 2;
const panelEmojiImageVerticalAlignment = panelEmojiSpriteVerticalAlignment - 1;

const panelDarkModeColors = [
  [colors.B50, darkPanelColors.B1200S],
  [colors.B75, darkPanelColors.B900],
  [colors.B100, darkPanelColors.B800S],
  [colors.N0, darkPanelColors.LightGray],
  [colors.N20, darkPanelColors.Gray],
  [colors.N60, darkPanelColors.DarkGray],
  [colors.T50, darkPanelColors.T1200S],
  [colors.T75, darkPanelColors.T900],
  [colors.T100, darkPanelColors.T900S],
  [colors.G50, darkPanelColors.G1200S],
  [colors.G75, darkPanelColors.G900],
  [colors.G200, darkPanelColors.G900S],
  [colors.Y50, darkPanelColors.Y1200S],
  [colors.Y75, darkPanelColors.Y900],
  [colors.Y200, darkPanelColors.Y800S],
  [colors.R50, darkPanelColors.R1200S],
  [colors.R75, darkPanelColors.R900],
  [colors.R100, darkPanelColors.R800S],
  [colors.P50, darkPanelColors.P1200S],
  [colors.P75, darkPanelColors.P900],
  [colors.P100, darkPanelColors.P800S],
];

export const getPanelDarkColor = (panelColor: string) => {
  const colorObject = panelDarkModeColors.find(
    (color) => color[0] === panelColor || color[1] === panelColor,
  );
  return colorObject ? colorObject[1] : darkPanelColors.B1200S;
};

export const getPanelBackgroundDarkModeColors = panelDarkModeColors
  .map(([colorName, colorValue]) => getPanelDarkModeCSS(colorName, colorValue))
  .join('\n');

export function getPanelDarkModeCSS(
  colorName: string,
  colorValue: string,
): string {
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
  addYourOwnEmoji: `[aria-label="Add your own emoji"]`,
  emojiNameInCustomEmoji: `[aria-label="Enter a name for the new emoji"]`,
  title: `#editor-title`,
  emojiPopup: `[aria-label="Popup"]`,
  searchEmoji: `[aria-label="Search emoji"]`,
  orangeWarningIcon: `[aria-label=":warning:"]`,
  yellowWarningIcon: `[aria-label=":warning:"]  span:nth-child(1)`,
  copyButton: `button[aria-label="Copy"]`,
};

const iconDynamicStyles =
  (panelType: Exclude<PanelType, PanelType.CUSTOM>) => (props: ThemeProps) => {
    const light = lightIconColor[panelType];
    const dark = darkIconColor[panelType];
    const color = themed({ light, dark })(props);
    return `
    color: ${color};
  `;
  };

export const getPanelTypeBackground = (
  panelType: Exclude<PanelType, PanelType.CUSTOM>,
  props: ThemeProps = {},
): string => {
  const light = lightPanelColor[panelType];
  const dark = darkPanelColors[panelType];
  const background = themed({ light, dark })(props);
  return background || 'none';
};

const mainDynamicStyles =
  (panelType: Exclude<PanelType, PanelType.CUSTOM>) => (props: ThemeProps) => {
    const background = getPanelTypeBackground(panelType, props);
    const text = themed({
      light: 'inherit',
      dark: darkPanelColors.TextColor,
    })(props);
    return `
    background-color: ${background};
    color: ${text};
  `;
  };

export const panelSharedStylesWithoutPrefix = (props: ThemeProps) => css`
  border-radius: ${borderRadius()}px;
  margin: ${blockNodesVerticalMargin} 0 0;
  padding: ${gridSize()}px;
  min-width: ${akEditorTableCellMinWidth}px;
  display: flex;
  position: relative;
  align-items: baseline;
  word-break: break-word;

  ${mainDynamicStyles(PanelType.INFO)(props)}

  .${PanelSharedCssClassName.icon} {
    flex-shrink: 0;
    height: ${gridSize() * 3}px;
    width: ${gridSize() * 3}px;
    box-sizing: content-box;
    padding-right: ${gridSize()}px;
    text-align: center;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    ${iconDynamicStyles(PanelType.INFO)(props)}

    > span {
      vertical-align: middle;
      display: inline-flex;
    }

    .${emojiSprite} {
      vertical-align: ${panelEmojiSpriteVerticalAlignment}px;
    }

    .${emojiImage} {
      vertical-align: ${panelEmojiImageVerticalAlignment}px;

      // Vertical align only works for inline-block elements in Firefox
      @-moz-document url-prefix() {
        img {
          display: inline-block;
        }
      }
    }
  }

  .ak-editor-panel__content {
    margin: 1px 0 1px;
    flex: 1 0 0;
    /*
      https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
      The default value for min-width is auto, which is computed to zero. When an element is a flex item, the value of min-width doesn’t compute to zero. The minimum size of a flex item is equal to the size of its contents.
    */
    min-width: 0;
  }

  &[data-panel-type='${PanelType.NOTE}'] {
    ${mainDynamicStyles(PanelType.NOTE)(props)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.NOTE)(props)}
    }
  }

  &[data-panel-type='${PanelType.TIP}'] {
    ${mainDynamicStyles(PanelType.TIP)(props)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.TIP)(props)}
    }
  }

  &[data-panel-type='${PanelType.WARNING}'] {
    ${mainDynamicStyles(PanelType.WARNING)(props)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.WARNING)(props)}
    }
  }

  &[data-panel-type='${PanelType.ERROR}'] {
    ${mainDynamicStyles(PanelType.ERROR)(props)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.ERROR)(props)}
    }
  }

  &[data-panel-type='${PanelType.SUCCESS}'] {
    ${mainDynamicStyles(PanelType.SUCCESS)(props)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.SUCCESS)(props)}
    }
  }

  &[data-panel-type='${PanelType.CUSTOM}'] {
    ${themed({ dark: getPanelBackgroundDarkModeColors })(props)};
  }
`;

export const panelSharedStyles = (props: ThemeProps) => css`
  .${PanelSharedCssClassName.prefix} {
    ${panelSharedStylesWithoutPrefix(props)}
  }
`;
