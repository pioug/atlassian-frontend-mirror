import { css } from 'styled-components';
import { gridSize, borderRadius, colors, themed } from '@atlaskit/theme';
import { PanelType, hexToRgba } from '@atlaskit/adf-schema';
import {
  akEditorTableCellMinWidth,
  akEditorDeleteBackground,
  akEditorDeleteBorder,
  akEditorSelectedBorderSize,
  akEditorDeleteIconColor,
  blockNodesVerticalMargin,
} from '../consts';

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

export const PanelSharedCssClassName = {
  PANEL_CONTAINER: 'ak-editor-panel',
};

const iconDynamicStyles = (panelType: PanelType) => (props: any) => {
  const light = lightIconColor[panelType];
  const dark = darkIconColor[panelType];
  const color = themed({ light, dark })(props);
  return `
    color: ${color};
  `;
};

const mainDynamicStyles = (panelType: PanelType) => (props: any) => {
  const light = lightPanelColor[panelType];
  const dark = hexToRgba(darkPanelColor[panelType], darkPanelOpacity);
  const darkText = darkTextColor[panelType];
  const background = themed({ light, dark })(props);
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
  .${PanelSharedCssClassName.PANEL_CONTAINER} {
    border-radius: ${borderRadius()}px;
    margin: ${blockNodesVerticalMargin} 0 0;
    padding: ${gridSize()}px;
    min-width: ${akEditorTableCellMinWidth}px;
    display: flex;
    align-items: baseline;
    word-break: break-word;

    ${mainDynamicStyles('info')}

    .ak-editor-panel__icon {
      display: block;
      flex-shrink: 0;
      height: ${gridSize() * 3}px;
      width: ${gridSize() * 3}px;
      box-sizing: content-box;
      padding-right: ${gridSize()}px;
      ${iconDynamicStyles('info')}

      > span {
        vertical-align: middle;
        display: inline;
      }
    }

    .ak-editor-panel__content {
      margin: 1px 0 1px;
      flex: 1 0 0;
    }

    &[data-panel-type='note'] {
      ${mainDynamicStyles('note')}

      .ak-editor-panel__icon {
        ${iconDynamicStyles('note')}
      }
    }

    &[data-panel-type='tip'] {
      ${mainDynamicStyles('tip')}

      .ak-editor-panel__icon {
        ${iconDynamicStyles('tip')}
      }
    }

    &[data-panel-type='warning'] {
      ${mainDynamicStyles('warning')}

      .ak-editor-panel__icon {
        ${iconDynamicStyles('warning')}
      }
    }

    &[data-panel-type='error'] {
      ${mainDynamicStyles('error')}

      .ak-editor-panel__icon {
        ${iconDynamicStyles('error')}
      }
    }

    &[data-panel-type='success'] {
      ${mainDynamicStyles('success')}

      .ak-editor-panel__icon {
        ${iconDynamicStyles('success')}
      }
    }

    /* Danger when top level node */
    &.danger {
      box-shadow: inset 0px 0px 0px ${akEditorSelectedBorderSize}px
        ${akEditorDeleteBorder};
      background: ${akEditorDeleteBackground} !important;

      .ak-editor-panel__icon {
        color: ${akEditorDeleteIconColor} !important;
      }
    }
  }

  /* Danger when nested node */
  & .danger .${PanelSharedCssClassName.PANEL_CONTAINER} {
    background: rgb(255, 189, 173, 0.5) !important; /* R75 with 50% opactiy */

    .ak-editor-panel__icon {
      color: ${akEditorDeleteIconColor} !important;
    }
  }
`;
