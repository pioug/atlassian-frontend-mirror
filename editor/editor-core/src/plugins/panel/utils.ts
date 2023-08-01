import type { DOMOutputSpec } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  Selection,
} from '@atlaskit/editor-prosemirror/state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { PanelAttributes } from '@atlaskit/adf-schema';
import { PanelType } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { hexToEditorBackgroundPaletteColor } from '@atlaskit/editor-palette';
import type { DomPanelAtrrs } from './types';

export const findPanel = (state: EditorState, selection?: Selection | null) => {
  const { panel } = state.schema.nodes;
  return (
    findSelectedNodeOfType(panel)(selection || state.selection) ||
    findParentNodeOfType(panel)(selection || state.selection)
  );
};

export const panelAttrsToDom = (
  attrs: PanelAttributes,
  allowCustomPanel: boolean,
): DOMOutputSpec => {
  const { panelColor, panelType, panelIcon, panelIconId, panelIconText } =
    attrs;
  const isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;
  const hasIcon = !isCustomPanel || !!panelIcon || !!panelIconId;

  const tokenColor =
    panelColor && hexToEditorBackgroundPaletteColor(panelColor);
  const panelBackgroundColor = tokenColor || panelColor;

  const style = [
    `${
      panelColor && isCustomPanel
        ? `background-color: ${panelBackgroundColor};`
        : ''
    }`,
    `${hasIcon ? '' : 'padding-left: 12px;'}`,
  ].join('');

  let panelAttrs: DomPanelAtrrs = {
    class: PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || PanelType.INFO,
    style,
  };
  if (panelColor && isCustomPanel) {
    panelAttrs = {
      ...panelAttrs,
      'data-panel-color': panelColor,
      'data-panel-icon-id': panelIconId,
      'data-panel-icon-text': panelIconText,
    };
  }
  const iconDiv: DOMOutputSpec = [
    'div',
    { class: PanelSharedCssClassName.icon },
  ];
  const contentDiv: DOMOutputSpec = [
    'div',
    {
      class: PanelSharedCssClassName.content,
    },
    0,
  ];

  if (hasIcon) {
    return ['div', panelAttrs, iconDiv, contentDiv];
  } else {
    return ['div', panelAttrs, contentDiv];
  }
};
