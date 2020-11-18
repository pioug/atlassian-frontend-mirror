import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { Selection, NodeSelection } from 'prosemirror-state';
import { PortalProviderAPI } from '../ui/PortalProvider';
import {
  stateKey as SelectionChangePluginKey,
  ReactNodeViewState,
} from '../plugins/base/pm-plugins/react-nodeview';
import { EventDispatcher } from '../event-dispatcher';
import { ReactComponentProps, shouldUpdate, getPosHandler } from './types';
import ReactNodeView from './ReactNodeView';

/**
 * A ReactNodeView that handles React components sensitive
 * to selection changes.
 *
 * If the selection changes, it will attempt to re-render the
 * React component. Otherwise it does nothing.
 *
 * You can subclass `viewShouldUpdate` to include other
 * props that your component might want to consider before
 * entering the React lifecycle. These are usually props you
 * compare in `shouldComponentUpdate`.
 *
 * An example:
 *
 * ```
 * viewShouldUpdate(nextNode) {
 *   if (nextNode.attrs !== this.node.attrs) {
 *     return true;
 *   }
 *
 *   return super.viewShouldUpdate(nextNode);
 * }```
 */

export class SelectionBasedNodeView<
  P = ReactComponentProps
> extends ReactNodeView<P> {
  private oldSelection: Selection;
  private selectionChangeState: ReactNodeViewState;

  pos: number | undefined;
  posEnd: number | undefined;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    eventDispatcher: EventDispatcher,
    reactComponentProps: P,
    reactComponent?: React.ComponentType<any>,
    hasContext: boolean = false,
    viewShouldUpdate?: shouldUpdate,
  ) {
    super(
      node,
      view,
      getPos,
      portalProviderAPI,
      eventDispatcher,
      reactComponentProps,
      reactComponent,
      hasContext,
      viewShouldUpdate,
    );

    this.updatePos();

    this.oldSelection = view.state.selection;
    this.selectionChangeState = SelectionChangePluginKey.getState(
      this.view.state,
    );
    this.selectionChangeState.subscribe(this.onSelectionChange);
  }

  /**
   * Update current node's start and end positions.
   *
   * Prefer `this.pos` rather than getPos(), because calling getPos is
   * expensive, unless you know you're definitely going to render.
   */
  private updatePos() {
    if (typeof this.getPos === 'boolean') {
      return;
    }
    this.pos = this.getPos();
    this.posEnd = this.pos + this.node.nodeSize;
  }

  private getPositionsWithDefault(pos?: number, posEnd?: number) {
    return {
      pos: typeof pos !== 'number' ? this.pos : pos,
      posEnd: typeof posEnd !== 'number' ? this.posEnd : posEnd,
    };
  }

  isNodeInsideSelection = (
    from: number,
    to: number,
    pos?: number,
    posEnd?: number,
  ) => {
    ({ pos, posEnd } = this.getPositionsWithDefault(pos, posEnd));

    if (typeof pos !== 'number' || typeof posEnd !== 'number') {
      return false;
    }

    return from <= pos && to >= posEnd;
  };

  isSelectionInsideNode = (
    from: number,
    to: number,
    pos?: number,
    posEnd?: number,
  ) => {
    ({ pos, posEnd } = this.getPositionsWithDefault(pos, posEnd));

    if (typeof pos !== 'number' || typeof posEnd !== 'number') {
      return false;
    }

    return pos < from && to < posEnd;
  };

  private isSelectedNode = (selection: Selection): boolean => {
    if (selection instanceof NodeSelection) {
      const {
        selection: { from, to },
      } = this.view.state;
      return (
        selection.node === this.node ||
        // If nodes are not the same object, we check if they are referring to the same document node
        (this.pos === from &&
          this.posEnd === to &&
          selection.node.eq(this.node))
      );
    }
    return false;
  };

  insideSelection = () => {
    const {
      selection: { from, to },
    } = this.view.state;

    return (
      this.isSelectedNode(this.view.state.selection) ||
      this.isSelectionInsideNode(from, to)
    );
  };

  viewShouldUpdate(_nextNode: PMNode) {
    const {
      state: { selection },
    } = this.view;

    // update selection
    const oldSelection = this.oldSelection;
    this.oldSelection = selection;

    // update cached positions
    const { pos: oldPos, posEnd: oldPosEnd } = this;
    this.updatePos();

    const { from, to } = selection;
    const { from: oldFrom, to: oldTo } = oldSelection;

    if (this.node.type.spec.selectable) {
      const newNodeSelection =
        selection instanceof NodeSelection && selection.from === this.pos;
      const oldNodeSelection =
        oldSelection instanceof NodeSelection && oldSelection.from === this.pos;

      if (
        (newNodeSelection && !oldNodeSelection) ||
        (oldNodeSelection && !newNodeSelection)
      ) {
        return true;
      }
    }

    const movedInToSelection =
      this.isNodeInsideSelection(from, to) &&
      !this.isNodeInsideSelection(oldFrom, oldTo);

    const movedOutOfSelection =
      !this.isNodeInsideSelection(from, to) &&
      this.isNodeInsideSelection(oldFrom, oldTo);

    const moveOutFromOldSelection =
      this.isNodeInsideSelection(from, to, oldPos, oldPosEnd) &&
      !this.isNodeInsideSelection(from, to);

    if (movedInToSelection || movedOutOfSelection || moveOutFromOldSelection) {
      return true;
    }

    return false;
  }

  destroy() {
    this.selectionChangeState.unsubscribe(this.onSelectionChange);
    super.destroy();
  }

  private onSelectionChange = () => {
    this.update(this.node, []);
  };
}
