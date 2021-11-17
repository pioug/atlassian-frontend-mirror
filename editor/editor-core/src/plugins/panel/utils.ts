import { DOMOutputSpec } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';
import { DomPanelAtrrs } from './types';

export const findPanel = (
  state: EditorState,
  selection?: Selection<any> | null,
) => {
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
  const { panelColor, panelType, panelIcon } = attrs;
  const isCustomPanel = panelType === PanelType.CUSTOM && allowCustomPanel;

  const style =
    panelColor && isCustomPanel ? `background-color: ${panelColor}` : '';
  const hasIcon = !isCustomPanel || !!panelIcon;

  let panelAttrs: DomPanelAtrrs = {
    class: PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || PanelType.INFO,
    style,
  };
  if (panelColor && isCustomPanel) {
    panelAttrs = { ...panelAttrs, 'data-panel-color': panelColor };
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
