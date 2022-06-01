import React from 'react';
import { NodeView, EditorProps, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

import type { PMPluginFactoryParams } from '../types';
import {
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
} from '../plugins/analytics';
import { analyticsEventKey } from '../plugins/analytics/consts';
import { ErrorBoundary } from '../ui/ErrorBoundary';

import {
  getPerformanceOptions,
  startMeasureReactNodeViewRendered,
  stopMeasureReactNodeViewRendered,
} from './getPerformanceOptions';

export type InlineNodeViewComponentProps = {
  view: EditorView;
  getPos: NodeViewParams['getPos'];
  node: PMNode;
};
type InlineNodeViewComponent<ExtraComponentProps> = React.ComponentType<
  InlineNodeViewComponentProps & ExtraComponentProps
>;

type CreateNodeViewOptions<ExtraComponentProps> = {
  nodeViewParams: NodeViewParams;
  pmPluginFactoryParams: PMPluginFactoryParams;
  Component: InlineNodeViewComponent<ExtraComponentProps>;
  extraComponentProps: ExtraComponentProps;
};

export const inlineNodeViewClassname = 'inlineNodeView';

function createNodeView<ExtraComponentProps>({
  nodeViewParams,
  pmPluginFactoryParams,
  Component,
  extraComponentProps,
}: CreateNodeViewOptions<ExtraComponentProps>) {
  // We set a variable for the current node which is
  // used for comparisions when doing updates, before being
  // overwritten to the updated node.
  let currentNode = nodeViewParams.node;

  // First we setup the dom element which will be rendered and "tracked" by prosemirror
  // and also used as a "editor portal" (not react portal) target by the editor
  // portal provider api, for rendering the Component passed.

  let domRef: HTMLSpanElement = document.createElement('span');
  domRef.contentEditable = 'false';
  setDomAttrs(nodeViewParams.node, domRef);

  // @see ED-3790
  // something gets messed up during mutation processing inside of a
  // nodeView if DOM structure has nested plain "div"s, it doesn't see the
  // difference between them and it kills the nodeView
  domRef.classList.add(
    `${nodeViewParams.node.type.name}View-content-wrap`,
    `${inlineNodeViewClassname}`,
  );

  // This util is shared for tracking rendering, and the ErrorBoundary that
  // is setup to wrap the Component when rendering
  // NOTE: This is not a prosemirror dispatch
  function dispatchAnalyticsEvent(payload: AnalyticsEventPayload) {
    pmPluginFactoryParams.eventDispatcher.emit(analyticsEventKey, {
      payload,
    });
  }

  // This is called to render the Component into domRef which is inside the
  // prosemirror View.
  // Internally it uses the unstable_renderSubtreeIntoContainer api to render,
  // to the passed dom element (domRef) which means it is automatically
  // "cleaned up" when you do a "re render".
  function renderComponent() {
    pmPluginFactoryParams.portalProviderAPI.render(
      getPortalChildren({
        dispatchAnalyticsEvent,
        currentNode,
        nodeViewParams,
        Component,
        extraComponentProps,
      }),
      domRef,
      false,
      // node views should be rendered with intl context
      true,
    );
  }

  const {
    samplingRate,
    slowThreshold,
    trackingEnabled,
  } = getPerformanceOptions(nodeViewParams.view);

  trackingEnabled &&
    startMeasureReactNodeViewRendered({ nodeTypeName: currentNode.type.name });

  // We render the component while creating the node view
  renderComponent();

  trackingEnabled &&
    stopMeasureReactNodeViewRendered({
      nodeTypeName: currentNode.type.name,
      dispatchAnalyticsEvent,
      editorState: nodeViewParams.view.state,
      samplingRate,
      slowThreshold,
    });

  // https://prosemirror.net/docs/ref/#view.NodeView
  const nodeView: NodeView = {
    get dom() {
      return domRef;
    },
    update(nextNode, _decorations) {
      // Let ProseMirror handle the update if node types are different.
      // This prevents an issue where it was not possible to select the
      // inline node view then replace it by entering text - the node
      // view contents would be deleted but the node view itself would
      // stay in the view and become uneditable.
      if (currentNode.type !== nextNode.type) {
        return false;
      }
      // On updates, we only set the new attributes if the type, attributes, and marks
      // have changed on the node.

      // NOTE: this could mean attrs changes aren't reflected in the dom,
      // when an attribute key which was previously present is no longer
      // present.
      // ie.
      // -> Original attributes { text: "hello world", color: "red" }
      // -> Updated attributes { color: "blue" }
      // in this case, the dom text attribute will not be cleared.
      //
      // This may not be an issue with any of our current node schemas.
      if (!currentNode.sameMarkup(nextNode)) {
        setDomAttrs(nextNode, domRef);
      }

      currentNode = nextNode;

      renderComponent();

      return true;
    },
    destroy() {
      // When prosemirror destroys the node view, we need to clean up
      // what we have previously rendered using the editor portal
      // provider api.
      pmPluginFactoryParams.portalProviderAPI.remove(domRef);
      // @ts-expect-error Expect an error as domRef is expected to be
      // of HTMLSpanElement type however once the node view has
      // been destroyed no other consumers should still be using it.
      domRef = undefined;
    },
  };

  return nodeView;
}

/**
 * Copies the attributes from a ProseMirror Node to a DOM node.
 * @param node The Prosemirror Node from which to source the attributes
 */
function setDomAttrs(node: PMNode, element: HTMLElement) {
  Object.keys(node.attrs || {}).forEach((attr) => {
    element.setAttribute(attr, node.attrs[attr]);
  });
}

function getPortalChildren<ExtraComponentProps>({
  dispatchAnalyticsEvent,
  currentNode,
  nodeViewParams,
  Component,
  extraComponentProps,
}: {
  dispatchAnalyticsEvent(payload: AnalyticsEventPayload): void;
  currentNode: PMNode;
  nodeViewParams: NodeViewParams;
  Component: InlineNodeViewComponent<ExtraComponentProps>;
  extraComponentProps: ExtraComponentProps;
}) {
  return function portalChildren() {
    //  All inline nodes use `display: inline` to allow for multi-line
    //  wrapping. This does produce an issue in Chrome where it is not
    //  possible to click select the position after the node,
    //  see: https://product-fabric.atlassian.net/browse/ED-12003
    //  however this is only a problem for node views that use
    //  `display: inline-block` somewhere within the Component.
    //  Looking at the below structure, spans with className
    //  `inlineNodeViewAddZeroWidthSpace` have pseudo elements that
    //  add a zero width space which fixes the problem.
    //  Without the additional zero width space before the Component,
    //  it is not possible to use the keyboard to range select in Safari.
    //
    //  Zero width spaces on either side of the Component also prevent
    //  the cursor from appearing inside the node view on all browsers.
    //
    //  Note:
    //  In future it is worth considering prohibiting the use of `display: inline-block`
    //  within inline node view Components however would require a sizable
    //  refactor. A test suite to catch any instances of this is ideal however
    //  the refactor required is currently out of scope for https://product-fabric.atlassian.net/browse/ED-14176
    return (
      <ErrorBoundary
        component={ACTION_SUBJECT.REACT_NODE_VIEW}
        componentId={
          (currentNode?.type?.name ??
            ACTION_SUBJECT_ID.UNKNOWN_NODE) as ACTION_SUBJECT_ID
        }
        dispatchAnalyticsEvent={dispatchAnalyticsEvent}
      >
        <span className={`${inlineNodeViewClassname}AddZeroWidthSpace`} />
        {ZERO_WIDTH_SPACE}
        <Component
          view={nodeViewParams.view}
          getPos={nodeViewParams.getPos}
          node={currentNode}
          {...extraComponentProps}
        />
        <span className={`${inlineNodeViewClassname}AddZeroWidthSpace`} />
      </ErrorBoundary>
    );
  };
}

// https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews
// The prosemirror EditorProps has a nodeViews key which has the rough shape:
// type nodeViews: {
//   [nodeViewName: string]: (node, editorView, getPos, decorations, innerDecorations) => NodeView
// }
// So the value of the keys on the nodeViews object, are a function which should return a NodeView.
// The following type NodeViewProducer, refers to these functions which return a NodeView.
//
// So the above type could also be described as
// type NodeViewProducer = (node, editorView, getPos, decorations, innerDecorations) => NodeView
// nodeViews: {
//   [nodeViewName: string]: NodeViewProducer
// }
type NodeViewProducer = NonNullable<EditorProps['nodeViews']>[string];
type NodeViewProducerParameters = Parameters<NodeViewProducer>;
type NodeViewParams = {
  node: Parameters<NodeViewProducer>[0];
  view: Parameters<NodeViewProducer>[1];
  getPos: Parameters<NodeViewProducer>[2];
  decorations: Parameters<NodeViewProducer>[3];
};

// This return of this function is intended to be the value of a key
// in a ProseMirror nodeViews object.
export function getInlineNodeViewProducer<ExtraComponentProps>({
  pmPluginFactoryParams,
  Component,
  extraComponentProps,
}: {
  // The value of the params parameter in PMPluginFactories
  pmPluginFactoryParams: PMPluginFactoryParams;
  // A React component
  Component: InlineNodeViewComponent<ExtraComponentProps>;
  // Any extra props to be passed through to the react component
  extraComponentProps?: ExtraComponentProps;
}): NodeViewProducer {
  function nodeViewProducer(
    ...nodeViewProducerParameters: NodeViewProducerParameters
  ) {
    const nodeView = createNodeView({
      nodeViewParams: {
        node: nodeViewProducerParameters[0],
        view: nodeViewProducerParameters[1],
        getPos: nodeViewProducerParameters[2],
        decorations: nodeViewProducerParameters[3],
      },
      pmPluginFactoryParams,
      Component,
      extraComponentProps,
    });

    return nodeView;
  }

  return nodeViewProducer;
}
