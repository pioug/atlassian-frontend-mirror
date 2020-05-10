import React from 'react';
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import {
  selectParentNodeOfType,
  findSelectedNodeOfType,
} from 'prosemirror-utils';
import { ProviderFactory, ExtensionHandlers } from '@atlaskit/editor-common';
import { ReactNodeView } from '../../../nodeviews';
import Extension from '../ui/Extension';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { ForwardRef, getPosHandler } from '../../../nodeviews/';
import { ZeroWidthSpace, setNodeSelection } from '../../../utils';
import { EventDispatcher } from '../../../event-dispatcher';
import { closestElement } from '../../../utils/dom';

export interface Props {
  node: PmNode;
  providerFactory: ProviderFactory;
  view: EditorView;
}

class ExtensionNode extends ReactNodeView {
  init() {
    super.init();
    if (this.dom) {
      this.dom.addEventListener('click', this.handleClick);
    }
    return this;
  }

  handleClick = (event: Event) => {
    // ignore if we are inside bodied extension's content
    const target = event.target as HTMLElement;
    if (closestElement(target, '.extension-content')) {
      return;
    }

    event.stopPropagation();

    const {
      state: { selection, schema, tr },
      dispatch,
    } = this.view;

    const hasBody = this.node.type.name === 'bodiedExtension';
    if (hasBody) {
      dispatch(selectParentNodeOfType([schema.nodes.bodiedExtension])(tr));
    } else if (
      !findSelectedNodeOfType([
        schema.nodes.inlineExtension,
        schema.nodes.extension,
        schema.nodes.bodiedExtension,
      ])(selection)
    ) {
      setNodeSelection(this.view, selection.$from.pos - 1);
    }
  };

  ignoreMutation(
    mutation: MutationRecord | { type: 'selection'; target: Element },
  ) {
    // Extensions can perform async operations that will change the DOM.
    // To avoid having their tree rebuilt, we need to ignore the mutation
    // for atom based extensions if its not a layout, we need to give
    // children a chance to recalc
    return (
      this.node.type.isAtom ||
      (mutation.type !== 'selection' &&
        mutation.attributeName !== 'data-layout')
    );
  }

  getContentDOM() {
    if (this.node.isInline) {
      return;
    }

    const dom = document.createElement('div');
    dom.className = `${this.node.type.name}-content-dom-wrapper`;
    return { dom };
  }

  render(
    props: {
      providerFactory: ProviderFactory;
      extensionHandlers: ExtensionHandlers;
    },
    forwardRef: ForwardRef,
  ) {
    return (
      <span>
        <Extension
          editorView={this.view}
          node={this.node}
          providerFactory={props.providerFactory}
          handleContentDOMRef={forwardRef}
          extensionHandlers={props.extensionHandlers}
        />
        {this.node.type.name === 'inlineExtension' && ZeroWidthSpace}
      </span>
    );
  }
}

export default function ExtensionNodeView(
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  extensionHandlers: ExtensionHandlers,
) {
  return (node: PmNode, view: EditorView, getPos: getPosHandler): NodeView => {
    return new ExtensionNode(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {
        providerFactory,
        extensionHandlers,
      },
    ).init();
  };
}
