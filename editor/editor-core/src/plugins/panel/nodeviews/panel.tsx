import React from 'react';
import ReactDOM from 'react-dom';
import { Node, DOMSerializer } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PanelSharedCssClassName } from '@atlaskit/editor-common/panel';
import { Emoji } from '@atlaskit/editor-common/emoji';
import { PanelPluginOptions } from '../types';
import { panelAttrsToDom } from '../utils';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';
import {
  PanelInfoIcon,
  PanelSuccessIcon,
  PanelNoteIcon,
  PanelWarningIcon,
  PanelErrorIcon,
} from '@atlaskit/editor-common/icons';

export const panelIcons: {
  [key in PanelType]: React.ComponentType<{ label: string }>;
} = {
  info: PanelInfoIcon,
  success: PanelSuccessIcon,
  note: PanelNoteIcon,
  tip: TipIcon,
  warning: PanelWarningIcon,
  error: PanelErrorIcon,
  custom: PanelInfoIcon,
};

interface PanelIconAttributes {
  panelAttributes: PanelAttributes;
  providerFactory?: ProviderFactory;
  allowCustomPanel?: boolean;
}

export const PanelIcon: React.FC<PanelIconAttributes> = (
  props: PanelIconAttributes,
) => {
  const {
    allowCustomPanel,
    providerFactory,
    panelAttributes: { panelType, panelIcon, panelIconId, panelIconText },
  } = props;

  if (allowCustomPanel && panelIcon && panelType === PanelType.CUSTOM) {
    return (
      <Emoji
        providers={providerFactory}
        shortName={panelIcon}
        id={panelIconId}
        fallback={panelIconText}
        showTooltip={false}
        allowTextFallback={false}
        fitToHeight={akEditorCustomIconSize}
      />
    );
  }

  const Icon = panelIcons[panelType];
  return <Icon label={`Panel ${panelType}`} />;
};

class PanelNodeView {
  node: Node;
  dom: HTMLElement;
  contentDOM: HTMLElement;
  icon: HTMLElement;
  getPos: getPosHandlerNode;
  view: EditorView;
  providerFactory?: ProviderFactory;
  pluginOptions: PanelPluginOptions;

  constructor(
    node: Node,
    view: EditorView,
    getPos: getPosHandlerNode,
    pluginOptions: PanelPluginOptions,
    providerFactory?: ProviderFactory,
  ) {
    this.providerFactory = providerFactory;
    this.pluginOptions = pluginOptions;
    this.view = view;
    this.node = node;

    const { dom, contentDOM } = DOMSerializer.renderSpec(
      document,
      panelAttrsToDom(
        node.attrs as PanelAttributes,
        pluginOptions.allowCustomPanel || false,
      ),
    );
    this.getPos = getPos;
    this.dom = dom as HTMLElement;
    this.contentDOM = contentDOM as HTMLElement;
    this.icon = this.dom.querySelector(
      `.${PanelSharedCssClassName.icon}`,
    ) as HTMLElement;

    if (!this.icon) {
      return;
    }
    // set contentEditable as false to be able to select the custom panels with keyboard
    this.icon.contentEditable = 'false';
    ReactDOM.render(
      <PanelIcon
        allowCustomPanel={pluginOptions.allowCustomPanel}
        panelAttributes={node.attrs as PanelAttributes}
        providerFactory={this.providerFactory}
      />,
      this.icon,
    );
  }

  ignoreMutation(
    mutation: MutationRecord | { type: 'selection'; target: Element },
  ) {
    // ignore mutation if it caused by the icon.
    const isIcon =
      mutation.target === this.icon || mutation.target.parentNode === this.icon;
    // ignore mutation if it caused by the lazy load emoji inside icon.
    const isInsideIcon = this.icon.contains(mutation.target);
    return isIcon || isInsideIcon;
  }
}

export const getPanelNodeView = (
  pluginOptions: PanelPluginOptions,
  providerFactory?: ProviderFactory,
) => (node: any, view: EditorView, getPos: getPosHandler): PanelNodeView => {
  return new PanelNodeView(
    node,
    view,
    getPos as getPosHandlerNode,
    pluginOptions,
    providerFactory,
  );
};
