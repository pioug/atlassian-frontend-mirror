import {
  PanelSharedCssClassName,
  PanelSharedSelectors,
} from '@atlaskit/editor-common';

export const panelSelectors = {
  panel: `.${PanelSharedCssClassName.prefix}`,
  panelContent: `.${PanelSharedCssClassName.content}`,
  panelIcon: `.${PanelSharedCssClassName.icon}`,
  infoPanel: PanelSharedSelectors.infoPanel,
  removeButton: PanelSharedSelectors.removeButton,
  icon: `.${PanelSharedCssClassName.icon}`,
};
