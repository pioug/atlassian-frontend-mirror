import React, {
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import { Subject } from 'rxjs/Subject';
import { v4 as uuid } from 'uuid';

import { Node } from '@atlaskit/editor-prosemirror/model';
import { Decoration, NodeView } from '@atlaskit/editor-prosemirror/view';

import { useEditorViewHasFocus } from '../../../state';
import { PortalActions } from '../../../ui/jql-editor-portal-provider/types';
import { ERROR_NODE, SELECTED_NODE } from '../constants';

export type NodeViewProps<Props> = Props & {
  selected: boolean;
  error: boolean;
};

export class ReactNodeView<Props> implements NodeView {
  private readonly component: FunctionComponent<NodeViewProps<Props>>;
  private readonly componentSubject: Subject<NodeViewProps<Props>> =
    new Subject();
  private readonly node: Node;
  private readonly portalActions: PortalActions;
  private readonly portalKey: string;

  public readonly dom: HTMLSpanElement;

  constructor(
    component: FunctionComponent<NodeViewProps<Props>>,
    portalActions: PortalActions,
    node: Node,
  ) {
    this.component = component;
    this.portalActions = portalActions;
    this.node = node;
    // Generate unique portal identifier
    // If you read this comment in the future and TypeScript has added support for Symbols as object keys, please do
    // JQL Editor a favor and replace this library with the native JS functionality that TS was supposed to support.
    this.portalKey = uuid();
    // Creating span under the assumption that all node views will be inline elements in JQL Editor
    this.dom = document.createElement('span');
    this.dom.setAttribute('data-testid', 'jql-editor-node-view');
  }

  static for<Props>(
    component: FunctionComponent<NodeViewProps<Props>>,
    portalActions: PortalActions,
    node: Node,
    decorations: readonly Decoration[],
  ) {
    return new ReactNodeView<Props>(component, portalActions, node).init(
      decorations,
    );
  }

  init = (decorations: readonly Decoration[]) => {
    const Component = this.component;

    const PortallingComponent = () => {
      const [state, setState] = useState<NodeViewProps<Props>>({
        ...this.getProps(this.node),
        selected: this.isSelected(decorations),
        error: this.hasError(decorations),
      });

      // ProseMirror keeps decorations on blur (as those are derived from editor state and focus isn't part of it),
      // but we don't want to show node views as selected when that happens. We could build a workaround for this in
      // richInlineNodesPlugin, but this hook will make selection behave more consistently with other focus-related features.
      const [hasFocus] = useEditorViewHasFocus();

      useEffect(() => {
        // Subscribe to the RxJS subject so concrete subclasses can emit events to re-render the node view component
        const subscription = this.componentSubject.subscribe(props => {
          setState(props);
        });

        return () => subscription.unsubscribe();
      }, []);

      useLayoutEffect(() => {
        if (state.error) {
          this.dom.dataset.tokenType = 'error';
        } else {
          delete this.dom.dataset.tokenType;
        }
      }, [state]);

      return <Component {...state} selected={state.selected && hasFocus} />;
    };

    // Ok, this is a tricky one. As everything that requires collaboration between ProseMirror and React.
    //
    // If we run `onCreatePortal` synchronously, ProseMirror won't insert the node view container (`this.dom`)
    // immediately into the DOM (as init function hasn't returned yet). This can trigger race conditions in other
    // code paths where ProseMirror may try to get DOM position for this node view before it has been inserted
    // (e.g. calculating new autocomplete position after insertion, or setting selection after the node).
    //
    // With `queueMicrotask` we can schedule this operation to be run after ProseMirror is done with the element
    // insertion, but before control of the execution context is returned to the browser's event loop. This should
    // prevent all conflicts with other pieces of asynchronous code and still render the portal as soon as it is
    // practically possible, so we can avoid flicker in situations where node views are reconstructed by ProseMirror.
    // @see https://github.com/ProseMirror/prosemirror/issues/872
    queueMicrotask(() => {
      this.portalActions.onCreatePortal(
        this.portalKey,
        <PortallingComponent />,
        this.dom,
      );
    });

    return this;
  };

  destroy = () => {
    this.portalActions.onDestroyPortal(this.portalKey);
  };

  update = (node: Node, decorations: readonly Decoration[]) => {
    // Update function may be called by ProseMirror with a node that has nothing to do with this node view ¯\_(ツ)_/¯
    // @see https://prosemirror.net/docs/ref/#view.NodeView.update
    if (node !== this.node) {
      return false;
    }

    this.componentSubject.next({
      ...this.getProps(node),
      selected: this.isSelected(decorations),
      error: this.hasError(decorations),
    });

    return true;
  };

  getProps = (node: Node): Props => {
    return { ...node.attrs } as Props;
  };

  private isSelected = (decorations: readonly Decoration[]) => {
    return decorations.some(
      decoration => decoration.spec.type === SELECTED_NODE,
    );
  };

  private hasError = (decorations: readonly Decoration[]) => {
    return decorations.some(decoration => decoration.spec.type === ERROR_NODE);
  };
}
