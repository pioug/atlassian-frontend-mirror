import React from 'react';
import { NodeView, EditorView, Decoration } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { PortalProviderAPI } from '../ui/PortalProvider';
import { Selection, NodeSelection } from 'prosemirror-state';

import {
  stateKey as SelectionChangePluginKey,
  ReactNodeViewState,
} from '../plugins/base/pm-plugins/react-nodeview';

export type getPosHandler = getPosHandlerNode | boolean;
export type getPosHandlerNode = () => number;
export type ReactComponentProps = { [key: string]: unknown };
export type ForwardRef = (node: HTMLElement | null) => void;
export type shouldUpdate = (nextNode: PMNode) => boolean;

export default class ReactNodeView<P = ReactComponentProps>
  implements NodeView {
  private domRef?: HTMLElement;
  private contentDOMWrapper?: Node;
  private reactComponent?: React.ComponentType<any>;
  private portalProviderAPI: PortalProviderAPI;
  private hasContext: boolean;
  private _viewShouldUpdate?: shouldUpdate;

  reactComponentProps: P;

  view: EditorView;
  getPos: getPosHandler;
  contentDOM: Node | undefined;
  node: PMNode;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    reactComponentProps?: P,
    reactComponent?: React.ComponentType<any>,
    hasContext: boolean = false,
    viewShouldUpdate?: shouldUpdate,
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.portalProviderAPI = portalProviderAPI;
    this.reactComponentProps = reactComponentProps || ({} as P);
    this.reactComponent = reactComponent;
    this.hasContext = hasContext;
    this._viewShouldUpdate = viewShouldUpdate;
  }

  /**
   * This method exists to move initialization logic out of the constructor,
   * so object can be initialized properly before calling render first time.
   *
   * Example:
   * Instance properties get added to an object only after super call in
   * constructor, which leads to some methods being undefined during the
   * first render.
   */
  init() {
    this.domRef = this.createDomRef();
    this.setDomAttrs(this.node, this.domRef);

    const { dom: contentDOMWrapper, contentDOM } = this.getContentDOM() || {
      dom: undefined,
      contentDOM: undefined,
    };

    if (this.domRef && contentDOMWrapper) {
      this.domRef.appendChild(contentDOMWrapper);
      this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper;
      this.contentDOMWrapper = contentDOMWrapper || contentDOM;
    }

    // @see ED-3790
    // something gets messed up during mutation processing inside of a
    // nodeView if DOM structure has nested plain "div"s, it doesn't see the
    // difference between them and it kills the nodeView
    this.domRef.classList.add(`${this.node.type.name}View-content-wrap`);

    this.renderReactComponent(() =>
      this.render(this.reactComponentProps, this.handleRef),
    );

    return this;
  }

  private renderReactComponent(
    component: () => React.ReactElement<any> | null,
  ) {
    if (!this.domRef || !component) {
      return;
    }

    this.portalProviderAPI.render(component, this.domRef!, this.hasContext);
  }

  createDomRef(): HTMLElement {
    return this.node.isInline
      ? document.createElement('span')
      : document.createElement('div');
  }

  getContentDOM():
    | { dom: Node; contentDOM?: Node | null | undefined }
    | undefined {
    return undefined;
  }

  handleRef = (node: HTMLElement | null) => this._handleRef(node);

  private _handleRef(node: HTMLElement | null) {
    const contentDOM = this.contentDOMWrapper || this.contentDOM;

    // move the contentDOM node inside the inner reference after rendering
    if (node && contentDOM && !node.contains(contentDOM)) {
      node.appendChild(contentDOM);
    }
  }

  render(props: P, forwardRef?: ForwardRef): React.ReactElement<any> | null {
    return this.reactComponent ? (
      <this.reactComponent
        view={this.view}
        getPos={this.getPos}
        node={this.node}
        forwardRef={forwardRef}
        {...props}
      />
    ) : null;
  }

  update(
    node: PMNode,
    _decorations: Array<Decoration>,
    validUpdate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
  ) {
    // @see https://github.com/ProseMirror/prosemirror/issues/648
    const isValidUpdate =
      this.node.type === node.type && validUpdate(this.node, node);

    if (!isValidUpdate) {
      return false;
    }

    if (this.domRef && !this.node.sameMarkup(node)) {
      this.setDomAttrs(node, this.domRef);
    }

    // View should not process a re-render if this is false.
    // We dont want to destroy the view, so we return true.
    if (!this.viewShouldUpdate(node)) {
      this.node = node;
      return true;
    }

    this.node = node;
    this.renderReactComponent(() =>
      this.render(this.reactComponentProps, this.handleRef),
    );

    return true;
  }

  viewShouldUpdate(nextNode: PMNode): boolean {
    if (this._viewShouldUpdate) {
      return this._viewShouldUpdate(nextNode);
    }

    return true;
  }

  /**
   * Copies the attributes from a ProseMirror Node to a DOM node.
   * @param node The Prosemirror Node from which to source the attributes
   */
  setDomAttrs(node: PMNode, element: HTMLElement) {
    Object.keys(node.attrs || {}).forEach(attr => {
      element.setAttribute(attr, node.attrs[attr]);
    });
  }

  get dom() {
    return this.domRef;
  }

  destroy() {
    if (!this.domRef) {
      return;
    }

    this.portalProviderAPI.remove(this.domRef);
    this.domRef = undefined;
    this.contentDOM = undefined;
  }

  static fromComponent(
    component: React.ComponentType<any>,
    portalProviderAPI: PortalProviderAPI,
    props?: ReactComponentProps,
    viewShouldUpdate?: (nextNode: PMNode) => boolean,
  ) {
    return (node: PMNode, view: EditorView, getPos: getPosHandler) =>
      new ReactNodeView(
        node,
        view,
        getPos,
        portalProviderAPI,
        props,
        component,
        false,
        viewShouldUpdate,
      ).init();
  }
}

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

  isSelectionInsideNode = (
    from: number,
    to: number,
    pos?: number,
    posEnd?: number,
  ) => {
    pos = typeof pos !== 'number' ? this.pos : pos;
    posEnd = typeof posEnd !== 'number' ? this.posEnd : posEnd;

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
      this.isSelectionInsideNode(from, to) &&
      !this.isSelectionInsideNode(oldFrom, oldTo);

    const movedOutOfSelection =
      !this.isSelectionInsideNode(from, to) &&
      this.isSelectionInsideNode(oldFrom, oldTo);

    const moveOutFromOldSelection =
      this.isSelectionInsideNode(from, to, oldPos, oldPosEnd) &&
      !this.isSelectionInsideNode(from, to);

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
