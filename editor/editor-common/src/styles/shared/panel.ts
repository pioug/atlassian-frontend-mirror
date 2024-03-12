/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { css } from '@emotion/react';

import { PanelType } from '@atlaskit/adf-schema';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import {
  akEditorTableCellMinWidth,
  blockNodesVerticalMargin,
} from '@atlaskit/editor-shared-styles';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import { emojiImage, emojiSprite } from '@atlaskit/emoji';
import {
  B100,
  B400,
  B50,
  B75,
  G200,
  G400,
  G50,
  G75,
  N0,
  N20,
  N60,
  P100,
  P400,
  P50,
  P75,
  R100,
  R400,
  R50,
  R75,
  T100,
  T50,
  T75,
  Y200,
  Y400,
  Y50,
  Y75,
} from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const lightPanelColors = {
  info: B50,
  note: P50,
  tip: G50,
  success: G50,
  warning: Y50,
  error: R50,
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
  info: token('color.icon.information', B400),
  note: token('color.icon.discovery', P400),
  tip: token('color.icon.success', G400),
  success: token('color.icon.success', G400),
  warning: token('color.icon.warning', Y400),
  error: token('color.icon.danger', R400),
};

// New custom icons are a little smaller than predefined icons.
// To fix alignment issues with custom icons, vertical alignment is updated.
const panelEmojiSpriteVerticalAlignment = -(8 * 3 - akEditorCustomIconSize) / 2;
const panelEmojiImageVerticalAlignment = panelEmojiSpriteVerticalAlignment - 1;

// TODO: https://product-fabric.atlassian.net/browse/DSP-4066
const panelDarkModeColors = [
  [B50, darkPanelColors.B1200S],
  [B75, darkPanelColors.B900],
  [B100, darkPanelColors.B800S],
  [N0, darkPanelColors.LightGray],
  [N20, darkPanelColors.Gray],
  [N60, darkPanelColors.DarkGray],
  [T50, darkPanelColors.T1200S],
  [T75, darkPanelColors.T900],
  [T100, darkPanelColors.T900S],
  [G50, darkPanelColors.G1200S],
  [G75, darkPanelColors.G900],
  [G200, darkPanelColors.G900S],
  [Y50, darkPanelColors.Y1200S],
  [Y75, darkPanelColors.Y900],
  [Y200, darkPanelColors.Y800S],
  [R50, darkPanelColors.R1200S],
  [R75, darkPanelColors.R900],
  [R100, darkPanelColors.R800S],
  [P50, darkPanelColors.P1200S],
  [P75, darkPanelColors.P900],
  [P100, darkPanelColors.P800S],
];

// used for custom panels
export const getPanelDarkColor = (panelColor: string) => {
  const colorObject = panelDarkModeColors.find(
    (color) => color[0] === panelColor || color[1] === panelColor,
  );
  return colorObject ? colorObject[1] : darkPanelColors.B1200S;
};

// used for custom panels
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
  addYourOwnEmoji: `#add-custom-emoji`,
  emojiNameInCustomEmoji: `[aria-label="Enter a name for the new emoji"]`,
  title: `#editor-title`,
  emojiPopup: `[aria-label="Popup"]`,
  searchEmoji: `[aria-label="Emoji name"]`,
  orangeWarningIcon: `[aria-label=":warning:"]`,
  yellowWarningIcon: `[aria-label=":warning:"]  span:nth-child(1)`,
  copyButton: `button[aria-label="Copy"]`,
};

const iconDynamicStyles = (panelType: Exclude<PanelType, PanelType.CUSTOM>) =>
  `color: ${lightIconColor[panelType]};`;

// Provides the color without tokens, used when converting to a custom panel
export const getPanelTypeBackgroundNoTokens = (
  panelType: Exclude<PanelType, PanelType.CUSTOM>,
): string => lightPanelColors[panelType] || 'none';

export const getPanelTypeBackground = (
  panelType: Exclude<PanelType, PanelType.CUSTOM>,
): string =>
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
    ${iconDynamicStyles(PanelType.INFO)}

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
    margin: ${token('space.025', '2px')} 0 ${token('space.025', '2px')};
    flex: 1 0 0;
    /*
      https://ishadeed.com/article/min-max-css/#setting-min-width-to-zero-with-flexbox
      The default value for min-width is auto, which is computed to zero. When an element is a flex item, the value of min-width doesn’t compute to zero. The minimum size of a flex item is equal to the size of its contents.
    */
    min-width: 0;
  }

  &[data-panel-type='${PanelType.NOTE}'] {
    ${mainDynamicStyles(PanelType.NOTE)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.NOTE)}
    }
  }

  &[data-panel-type='${PanelType.TIP}'] {
    ${mainDynamicStyles(PanelType.TIP)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.TIP)}
    }
  }

  &[data-panel-type='${PanelType.WARNING}'] {
    ${mainDynamicStyles(PanelType.WARNING)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.WARNING)}
    }
  }

  &[data-panel-type='${PanelType.ERROR}'] {
    ${mainDynamicStyles(PanelType.ERROR)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.ERROR)}
    }
  }

  &[data-panel-type='${PanelType.SUCCESS}'] {
    ${mainDynamicStyles(PanelType.SUCCESS)}

    .${PanelSharedCssClassName.icon} {
      ${iconDynamicStyles(PanelType.SUCCESS)}
    }
  }
`;

export const panelSharedStyles = () =>
  css({
    [`.${PanelSharedCssClassName.prefix}`]: panelSharedStylesWithoutPrefix(),
  });
