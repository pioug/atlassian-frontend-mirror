import { css } from 'styled-components';

import { hexToRgba, PanelType } from '@atlaskit/adf-schema';
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

const darkPanelOpacity = 0.64;
const darkPanelColor = {
  info: colors.B500,
  note: colors.P500,
  tip: colors.G500,
  success: colors.G500,
  warning: colors.Y500,
  error: colors.R500,
};
const darkPanelBorderColor = {
  info: colors.B400,
  note: colors.P400,
  tip: colors.G400,
  success: colors.G400,
  warning: colors.Y400,
  error: colors.R400,
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
const darkTextColor = {
  info: colors.B75,
  note: colors.P75,
  tip: colors.G75,
  success: colors.G75,
  warning: colors.Y75,
  error: colors.R75,
};

const verticalAlignment = -((gridSize() * 3 - akEditorCustomIconSize) / 2);

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
  removeButton: `button[aria-label="Remove"]`,
  colorPalette: `[aria-label="Background color"]`,
  selectedColor: `[aria-label="The smell"]`,
  removeEmojiIcon: `[aria-label="Remove emoji"]`,
  emojiIcon: `[aria-label="editor-add-emoji"]`,
  selectedEmoji: `[aria-label=":grinning:"]`,
  title: `#editor-title`,
};

const iconDynamicStyles = (panelType: Exclude<PanelType, PanelType.CUSTOM>) => (
  props: ThemeProps,
) => {
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
  const dark = hexToRgba(darkPanelColor[panelType], darkPanelOpacity);
  const background = themed({ light, dark })(props);
  return background || 'none';
};

const mainDynamicStyles = (panelType: Exclude<PanelType, PanelType.CUSTOM>) => (
  props: ThemeProps,
) => {
  const background = getPanelTypeBackground(panelType, props);
  const darkText = darkTextColor[panelType];
  const darkBorder = '1px solid ' + darkPanelBorderColor[panelType];
  const border = themed({ light: 'none', dark: darkBorder })(props);
  const text = themed({ light: 'inherit', dark: darkText })(props);
  return `
    background-color: ${background};
    border: ${border};
    color: ${text};
  `;
};

export const panelSharedStyles = css`
  .${PanelSharedCssClassName.prefix} {
    border-radius: ${borderRadius()}px;
    margin: ${blockNodesVerticalMargin} 0 0;
    padding: ${gridSize()}px;
    min-width: ${akEditorTableCellMinWidth}px;
    display: flex;
    align-items: baseline;
    word-break: break-word;

    ${mainDynamicStyles(PanelType.INFO)}

    .${PanelSharedCssClassName.icon} {
      display: block;
      flex-shrink: 0;
      height: ${gridSize() * 3}px;
      width: ${gridSize() * 3}px;
      box-sizing: content-box;
      padding-right: ${gridSize()}px;
      text-align: center;
      ${iconDynamicStyles(PanelType.INFO)}

      > span {
        vertical-align: middle;
        display: inline;
      }

      .${emojiSprite}, .${emojiImage} {
        vertical-align: ${verticalAlignment}px;
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

    &[data-panel-type='${PanelType.CUSTOM}'] {
      .${PanelSharedCssClassName.icon} {
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      }
    }
  }
`;
