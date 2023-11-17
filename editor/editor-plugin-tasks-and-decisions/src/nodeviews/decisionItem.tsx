import React from 'react';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
  Decoration,
  EditorView,
  NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type { TasksAndDecisionsPlugin } from '../types';
import DecisionItem from '../ui/Decision';

import { useShowPlaceholder } from './hooks/use-show-placeholder';

type ForwardRef = (node: HTMLElement | null) => void;
type getPosHandler = getPosHandlerNode | boolean;
type getPosHandlerNode = () => number | undefined;

type DecisionItemWrapperProps = {
  forwardRef: ForwardRef;
  isContentNodeEmpty: boolean;
  getPos: () => number | undefined;
  api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
  editorView: EditorView;
};
const DecisionItemWrapper = ({
  api,
  editorView,
  forwardRef,
  isContentNodeEmpty,
  getPos,
}: DecisionItemWrapperProps) => {
  const showPlaceholder = useShowPlaceholder({
    editorView,
    isContentNodeEmpty,
    getPos,
    api,
  });

  return (
    <DecisionItem contentRef={forwardRef} showPlaceholder={showPlaceholder} />
  );
};

class Decision extends ReactNodeView {
  private api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;

  private isContentEmpty(node: PMNode) {
    return node.content.childCount === 0;
  }

  initWithAPI(api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined) {
    this.api = api;
    this.init();
    return this;
  }

  createDomRef() {
    const domRef = document.createElement('li');
    domRef.style.listStyleType = 'none';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    // setting a className prevents PM/Chrome mutation observer from
    // incorrectly deleting nodes
    dom.className = 'decision-item';
    return { dom };
  }

  render(_props: never, forwardRef: ForwardRef) {
    const isContentNodeEmpty = this.isContentEmpty(this.node);
    return (
      <DecisionItemWrapper
        forwardRef={forwardRef}
        isContentNodeEmpty={isContentNodeEmpty}
        api={this.api}
        // The getPosHandler type is wrong, there is no `boolean` in the real implementation
        // @ts-expect-error 2322: Type 'getPosHandler' is not assignable to type '() => number | undefined'.
        getPos={this.getPos}
        editorView={this.view}
      />
    );
  }

  viewShouldUpdate(nextNode: PMNode) {
    /**
     * To ensure the placeholder is correctly toggled we need to allow react to re-render
     * on first character insertion.
     * Note: last character deletion is handled externally and automatically re-renders.
     */
    return this.isContentEmpty(this.node) && !!nextNode.content.childCount;
  }

  update(node: PMNode, decorations: readonly Decoration[]) {
    return super.update(
      node,
      decorations,
      undefined,
      // Toggle the placeholder based on whether user input exists.
      (_currentNode, _newNode) => !this.isContentEmpty(_newNode),
    );
  }
}

export const decisionItemNodeView =
  (
    portalProviderAPI: PortalProviderAPI,
    eventDispatcher: EventDispatcher,
    api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
  ) =>
  (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
    const hasIntlContext = true;
    return new Decision(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      {},
      undefined,
      undefined,
      undefined,
      hasIntlContext,
    ).initWithAPI(api);
  };
