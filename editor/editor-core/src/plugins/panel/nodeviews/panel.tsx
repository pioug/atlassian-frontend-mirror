import React from 'react';
import ReactDOM from 'react-dom';
import { Node, DOMSerializer } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import SuccessIcon from '@atlaskit/icon/glyph/editor/success';
import NoteIcon from '@atlaskit/icon/glyph/editor/note';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import ErrorIcon from '@atlaskit/icon/glyph/editor/error';
import TipIcon from '@atlaskit/icon/glyph/editor/hint';
import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import {
  PanelSharedCssClassName,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { Emoji } from '@atlaskit/editor-common';
import { PanelPluginOptions } from '../types';
import { panelAttrsToDom } from '../utils';
import { akEditorCustomIconSize } from '@atlaskit/editor-shared-styles/consts';

export const panelIcons: {
  [key in PanelType]: React.ComponentType<{ label: string }>;
} = {
  info: InfoIcon,
  success: SuccessIcon,
  note: NoteIcon,
  tip: TipIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  custom: InfoIcon,
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
    panelAttributes: { panelType, panelIcon },
  } = props;

  if (allowCustomPanel && panelIcon && panelType === PanelType.CUSTOM) {
    return (
      <Emoji
        providers={providerFactory}
        shortName={panelIcon}
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
        pluginOptions.UNSAFE_allowCustomPanel || false,
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
        allowCustomPanel={pluginOptions.UNSAFE_allowCustomPanel}
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
    return mutation.target === this.icon;
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
