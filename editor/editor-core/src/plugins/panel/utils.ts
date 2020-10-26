import { DOMOutputSpec } from 'prosemirror-model';
import { EditorState, Selection } from 'prosemirror-state';
import {
  findSelectedNodeOfType,
  findParentNodeOfType,
} from 'prosemirror-utils';
import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { PanelSharedCssClassName } from '@atlaskit/editor-common';

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

  const panelAttrs = {
    class: PanelSharedCssClassName.prefix,
    'data-panel-type': panelType || PanelType.INFO,
    style,
  };
  const iconSpan: DOMOutputSpec = [
    'span',
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
    return ['div', panelAttrs, iconSpan, contentDiv];
  } else {
    return ['div', panelAttrs, contentDiv];
  }
};
