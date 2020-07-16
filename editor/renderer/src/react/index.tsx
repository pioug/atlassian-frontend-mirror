import React from 'react';
import { ComponentType } from 'react';
import { Fragment, Mark, MarkType, Node } from 'prosemirror-model';
import { Serializer } from '../';
import {
  RendererAppearance,
  StickyHeaderConfig,
  HeadingAnchorLinksProps,
} from '../ui/Renderer/types';
import { isNestedHeaderLinksEnabled } from './utils/links';
import { AnalyticsEventPayload } from '../analytics/events';

import {
  Doc,
  mergeTextNodes,
  isTextWrapper,
  isTextNode,
  TextWrapper,
  toReact,
} from './nodes';
import TextWrapperComponent from './nodes/text-wrapper';

import { toReact as markToReact, AnnotationContext } from './marks';
import {
  ProviderFactory,
  getMarksByOrder,
  isSameMark,
  EventHandlers,
  ExtensionHandlers,
  calcTableColumnWidths,
} from '@atlaskit/editor-common';
import { getText } from '../utils';
import { findChildrenByType } from 'prosemirror-utils';
import { RendererContext, NodeMeta, MarkMeta } from './types';
import { AnnotationId, AnnotationMarkStates } from '@atlaskit/adf-schema';
import { insideBreakoutLayout } from './renderer-node';

export { AnnotationContext };
export interface ReactSerializerInit {
  providers?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  portal?: HTMLElement;
  objectContext?: RendererContext;
  appearance?: RendererAppearance;
  disableHeadingIDs?: boolean;
  disableActions?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  allowColumnSorting?: boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
  stickyHeaders?: StickyHeaderConfig;
  allowMediaLinking?: boolean;
  allowAnnotations?: boolean;
  surroundTextNodesWithTextWrapper?: boolean;
  getAnnotationPromise?: (
    id: AnnotationId,
  ) => Promise<AnnotationMarkStates | null>;
}

interface ParentInfo {
  parentIsIncompleteTask: boolean;
  path: Array<Node>;
  pos: number;
}

interface FragmentChildContext {
  parentInfo?: ParentInfo;
  index: number;
}

type MarkWithContent = Partial<Mark<any>> & {
  content: Array<MarkWithContent | Node<any>>;
};

function mergeMarks(marksAndNodes: Array<MarkWithContent | Node>) {
  return marksAndNodes.reduce((acc, markOrNode) => {
    const prev = (acc.length && acc[acc.length - 1]) || null;

    if (
      markOrNode.type instanceof MarkType &&
      prev &&
      prev.type instanceof MarkType &&
      Array.isArray(prev.content) &&
      isSameMark(prev as Mark, markOrNode as Mark)
    ) {
      prev.content = mergeMarks(
        prev.content.concat((markOrNode as MarkWithContent).content),
      );
    } else {
      acc.push(markOrNode);
    }

    return acc;
  }, [] as Array<MarkWithContent | Node>);
}

type AnnotationConfig = {
  allowAnnotations: boolean;
  getAnnotationPromise:
    | null
    | ((id: AnnotationId) => Promise<AnnotationMarkStates | null>);
};

export default class ReactSerializer implements Serializer<JSX.Element> {
  private providers?: ProviderFactory;
  private eventHandlers?: EventHandlers;
  private extensionHandlers?: ExtensionHandlers;
  private portal?: HTMLElement;
  private rendererContext?: RendererContext;
  private appearance?: RendererAppearance;
  private disableHeadingIDs?: boolean;
  private disableActions?: boolean;
  private headingIds: string[] = [];
  /**
   * The reason we have this extra array here is because we need to generate the same unique
   * heading id for 2 different nodes: headers and expands (check the implementation of
   * `getUniqueHeadingId` for more info).
   *
   * We will eventually need to refactor the current approach to generate unique ids
   * for headers under this ticket -> https://product-fabric.atlassian.net/browse/ED-9668
   */
  private expandHeadingIds: string[] = [];
  private allowDynamicTextSizing?: boolean;
  private allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  private allowColumnSorting?: boolean;
  private fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  private shouldOpenMediaViewer?: boolean;
  private allowAltTextOnImages?: boolean;
  private stickyHeaders?: StickyHeaderConfig;
  private allowMediaLinking?: boolean;
  private startPos: number = 1;
  private surroundTextNodesWithTextWrapper: boolean = false;
  private annotationsConfig: AnnotationConfig = {
    allowAnnotations: false,
    getAnnotationPromise: null,
  };

  constructor(init: ReactSerializerInit) {
    this.providers = init.providers;
    this.eventHandlers = init.eventHandlers;
    this.extensionHandlers = init.extensionHandlers;
    this.portal = init.portal;
    this.rendererContext = init.objectContext;
    this.appearance = init.appearance;
    this.disableHeadingIDs = init.disableHeadingIDs;
    this.disableActions = init.disableActions;
    this.allowDynamicTextSizing = init.allowDynamicTextSizing;
    this.allowHeadingAnchorLinks = init.allowHeadingAnchorLinks;
    this.allowColumnSorting = init.allowColumnSorting;
    this.fireAnalyticsEvent = init.fireAnalyticsEvent;
    this.shouldOpenMediaViewer = init.shouldOpenMediaViewer;
    this.allowAltTextOnImages = init.allowAltTextOnImages;
    this.stickyHeaders = init.stickyHeaders;
    this.allowMediaLinking = init.allowMediaLinking;
    this.annotationsConfig = {
      allowAnnotations: Boolean(init.allowAnnotations),
      getAnnotationPromise: init.getAnnotationPromise || null,
    };
    this.surroundTextNodesWithTextWrapper = Boolean(
      init.surroundTextNodesWithTextWrapper,
    );
  }

  private resetState() {
    this.headingIds = [];
    this.expandHeadingIds = [];
    this.startPos = 1;
  }

  private getNodeProps(node: Node, parentInfo?: ParentInfo) {
    const path = parentInfo ? parentInfo.path : undefined;

    switch (node.type.name) {
      case 'date':
        return this.getDateProps(node, parentInfo);
      case 'hardBreak':
        return this.getHardBreakProps(node, path);
      case 'heading':
        return this.getHeadingProps(node, path);
      case 'media':
        return this.getMediaProps(node);
      case 'mediaSingle':
        return this.getMediaSingleProps(node, path);
      case 'table':
        return this.getTableProps(node, path);
      case 'tableHeader':
      case 'tableRow':
        return this.getTableChildrenProps(node);
      case 'taskItem':
        return this.getTaskItemProps(node, path);
      case 'embedCard':
        return this.getEmbedCardProps(node, path);
      case 'expand':
        return this.getExpandProps(node, path);
      default:
        return this.getProps(node, path);
    }
  }

  serializeFragment(
    fragment: Fragment,
    props: any = {},
    target: any = Doc,
    key: string = 'root-0',
    parentInfo?: ParentInfo,
  ): JSX.Element | null {
    // This makes sure that we reset internal state on re-render.
    if (key === 'root-0') {
      this.resetState();
    }

    return this.renderNode(
      target,
      props,
      key,
      ReactSerializer.getChildNodes(fragment).map((node, index) => {
        if (isTextWrapper(node)) {
          return this.serializeTextWrapper(node.content, { index, parentInfo });
        }
        return this.serializeFragmentChild(node, { index, parentInfo });
      }),
    );
  }

  private serializeFragmentChild = (
    node: Node,
    { index, parentInfo }: FragmentChildContext,
  ) => {
    const pos = this.startPos;
    const currentPath = (parentInfo && parentInfo.path) || [];

    const parentIsIncompleteTask =
      node.type.name === 'taskItem' && node.attrs.state !== 'DONE';

    const serializedContent = this.serializeFragment(
      node.content,
      this.getNodeProps(node, parentInfo),
      toReact(node),
      `${node.type.name}-${index}`,
      {
        parentIsIncompleteTask,
        path: [...currentPath, node],
        pos: this.startPos,
      },
    );

    this.startPos = pos + node.nodeSize;

    const marks = node.marks ? [...node.marks] : [];
    const isMediaSingle = node.type.name === 'mediaSingle';

    const shouldSkipMark = (mark: Mark): boolean =>
      this.allowMediaLinking !== true &&
      isMediaSingle &&
      mark.type.name === 'link';

    return marks.reverse().reduce((content, mark) => {
      if (shouldSkipMark(mark)) {
        return content;
      }

      return this.renderMark(
        markToReact(mark),
        this.withMediaMarkProps(node, mark, this.getMarkProps(mark)),
        `${mark.type.name}-${index}`,
        content,
      );
    }, serializedContent);
  };

  private withMediaMarkProps = (
    node: Node,
    mark: Mark,
    defaultProps: any,
  ): any => {
    if (mark.type.name === 'link' && node.type.name === 'mediaSingle') {
      return {
        ...defaultProps,
        isMediaLink: true,
      };
    }

    return defaultProps;
  };

  private withAnnotationMarkProps = (mark: Mark, defaultProps: any): any => {
    const { getAnnotationPromise, allowAnnotations } = this.annotationsConfig;
    if (!allowAnnotations || typeof getAnnotationPromise !== 'function') {
      return defaultProps;
    }

    return {
      ...defaultProps,
      getAnnotationState: getAnnotationPromise,
    };
  };

  private serializeTextWrapper(
    content: Node[],
    { index, parentInfo }: FragmentChildContext,
  ) {
    const currentPath = (parentInfo && parentInfo.path) || [];
    const depth = currentPath.length;
    return ReactSerializer.buildMarkStructure(content).map((mark, index) =>
      this.serializeMark(mark, index, depth),
    );
  }

  private serializeMark(mark: Mark, index: number = 0, depth: number = 0) {
    if (!isTextNode(mark)) {
      const content = (
        (mark as any).content || []
      ).map((child: Mark, index: number) => this.serializeMark(child, index));
      return this.renderMark(
        markToReact(mark),
        this.getMarkProps(mark),
        `${mark.type.name}-${index}`,
        content,
      );
    }

    if (this.surroundTextNodesWithTextWrapper) {
      const startPos = this.startPos;
      const endPos = startPos + mark.nodeSize;
      const parentDepth = depth - 1;
      return (
        <TextWrapperComponent
          key={`${index}-text-content`}
          startPos={startPos + parentDepth}
          endPos={endPos + parentDepth}
          text={mark.text}
        />
      );
    }

    this.startPos += mark.nodeSize;

    return mark.text;
  }

  private renderNode(
    NodeComponent: ComponentType<any>,
    props: any,
    key: string,
    content: string | JSX.Element | any[] | null | undefined,
  ): JSX.Element {
    return (
      <NodeComponent key={key} {...props}>
        {content}
      </NodeComponent>
    );
  }

  private renderMark(
    MarkComponent: ComponentType<any>,
    props: any,
    key: string,
    content: any,
  ) {
    return (
      <MarkComponent key={key} {...props}>
        {content}
      </MarkComponent>
    );
  }

  private getTableChildrenProps(node: Node) {
    return {
      ...this.getProps(node),
      allowColumnSorting: this.allowColumnSorting,
    };
  }

  private getTableProps(node: Node, path: Array<Node> = []) {
    // TODO: https://product-fabric.atlassian.net/browse/CEMS-1048
    const stickyHeaders = !insideBreakoutLayout(path)
      ? this.stickyHeaders
      : undefined;

    return {
      ...this.getProps(node),
      allowColumnSorting: this.allowColumnSorting,
      columnWidths: calcTableColumnWidths(node),
      tableNode: node,
      stickyHeaders,
    };
  }

  private getDateProps(
    node: Node,
    parentInfo: { parentIsIncompleteTask: boolean } | undefined,
  ) {
    return {
      timestamp: node.attrs && node.attrs.timestamp,
      parentIsIncompleteTask: parentInfo && parentInfo.parentIsIncompleteTask,
    };
  }

  private getMediaSingleProps(node: Node, path: Array<Node> = []) {
    const {
      nodes: { expand, nestedExpand, layoutColumn },
      marks: { link },
    } = node.type.schema;
    const blockNodeNames = [expand, nestedExpand, layoutColumn]
      .filter(node => Boolean(node)) // Check if the node exist first
      .map(node => node.name);
    const isInsideOfBlockNode =
      path &&
      path.some(n => n.type && blockNodeNames.indexOf(n.type.name) > -1);

    const isLinkMark = (mark: Mark) => mark.type === link;

    return {
      ...this.getProps(node),
      marks: node.marks.filter(
        m => !isLinkMark(m) || this.allowMediaLinking === true,
      ),
      isLinkMark,
      isInsideOfBlockNode,
    };
  }

  private getEmbedCardProps(node: Node, path: Array<Node> = []) {
    const {
      nodes: { expand, nestedExpand, layoutColumn },
    } = node.type.schema;
    const blockNodeNames = [expand, nestedExpand, layoutColumn]
      .filter(node => Boolean(node)) // Check if the node exist first
      .map(node => node.name);
    const isInsideOfBlockNode =
      path &&
      path.some(n => n.type && blockNodeNames.indexOf(n.type.name) > -1);
    return {
      ...this.getProps(node),
      isInsideOfBlockNode,
    };
  }

  private getMediaProps(node: Node) {
    return {
      ...this.getProps(node),
      shouldOpenMediaViewer: this.shouldOpenMediaViewer,
      allowAltTextOnImages: this.allowAltTextOnImages,
    };
  }

  private getTaskItemProps(node: Node, path: Array<Node> = []) {
    return {
      ...this.getProps(node, path),
      disabled: this.disableActions,
    };
  }

  private getHardBreakProps(node: Node, path: Array<Node> = []) {
    let forceNewLine = false;

    const parentNode: Node | null =
      path.length > 0 ? path[path.length - 1] : null;

    if (parentNode && parentNode.lastChild === node) {
      forceNewLine = true;
    }

    return {
      ...this.getProps(node),
      forceNewLine,
    };
  }

  private getProps(node: Node, path: Array<Node> = []): NodeMeta {
    return {
      text: node.text,
      providers: this.providers,
      eventHandlers: this.eventHandlers,
      extensionHandlers: this.extensionHandlers,
      portal: this.portal,
      rendererContext: this.rendererContext,
      serializer: this,
      content: node.content ? node.content.toJSON() : undefined,
      allowDynamicTextSizing: this.allowDynamicTextSizing,
      allowHeadingAnchorLinks: this.allowHeadingAnchorLinks,
      rendererAppearance: this.appearance,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      nodeType: node.type.name,
      marks: node.marks,
      dataAttributes: {
        // We need to account for depth (path.length gives up depth) here
        // but depth doesnt increment the pos, only accounted for.
        'data-renderer-start-pos': this.startPos + path.length,
      },
      ...node.attrs,
    };
  }

  private headingAnchorSupported(path: Array<Node> = []): boolean {
    return (
      isNestedHeaderLinksEnabled(this.allowHeadingAnchorLinks) ||
      path.length === 0 ||
      path[path.length - 1].type.name === 'layoutColumn'
    );
  }

  private getHeadingProps(node: Node, path: Array<Node> = []) {
    return {
      ...this.getProps(node, path),
      content: node.content ? node.content.toJSON() : undefined,
      headingId: this.getHeadingId(node, this.headingIds),
      enableNestedHeaderLinks: isNestedHeaderLinksEnabled(
        this.allowHeadingAnchorLinks,
      ),
      showAnchorLink:
        this.allowHeadingAnchorLinks &&
        !this.disableHeadingIDs &&
        this.headingAnchorSupported(path),
    };
  }

  private getExpandProps(node: Node, path: Array<Node> = []) {
    if (!isNestedHeaderLinksEnabled(this.allowHeadingAnchorLinks)) {
      return this.getProps(node);
    }

    const nestedHeaderIds = findChildrenByType(
      node,
      node.type.schema.nodes.heading,
    ).map(({ node }) => this.getHeadingId(node, this.expandHeadingIds));

    return {
      ...this.getProps(node),
      nestedHeaderIds,
    };
  }

  // The return value of this function is NOT url encoded,
  // In HTML5 standard, id can contain any characters, encoding is no necessary.
  // Plus we trying to avoid double encoding, therefore we leave the value as is.
  // Remember to use encodeURIComponent when generating url from the id value.
  private getHeadingId(node: Node, headingIds: string[]) {
    if (this.disableHeadingIDs || !node.content.size) {
      return;
    }

    // We are not use node.textContent here, because we would like to handle cases where
    // headings only contain inline blocks like emoji, status and date.
    const nodeContent = (node as any).content
      .toJSON()
      .reduce((acc: string, node: any) => acc.concat(getText(node) || ''), '')
      .trim()
      .replace(/\s/g, '-');

    if (!nodeContent) {
      return;
    }

    return this.getUniqueHeadingId(nodeContent, headingIds);
  }

  private getUniqueHeadingId(
    baseId: string,
    headingIds: string[],
    counter = 0,
  ): string {
    if (counter === 0 && headingIds.indexOf(baseId) === -1) {
      headingIds.push(baseId);
      return baseId;
    } else if (counter !== 0) {
      const headingId = `${baseId}.${counter}`;
      if (headingIds.indexOf(headingId) === -1) {
        headingIds.push(headingId);
        return headingId;
      }
    }

    return this.getUniqueHeadingId(baseId, headingIds, ++counter);
  }

  private getMarkProps = (mark: Mark): MarkMeta => {
    const { key, ...otherAttrs } = mark.attrs;
    return this.withAnnotationMarkProps(mark, {
      eventHandlers: this.eventHandlers,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      markKey: key,
      ...otherAttrs,
      dataAttributes: {
        'data-renderer-mark': true,
      },
    });
  };

  static getChildNodes(fragment: Fragment): (Node | TextWrapper)[] {
    const children: Node[] = [];
    fragment.forEach(node => {
      children.push(node);
    });
    return mergeTextNodes(children) as Node[];
  }

  static getMarks(node: Node): Mark[] {
    if (!node.marks || node.marks.length === 0) {
      return [];
    }

    return getMarksByOrder(node.marks);
  }

  static buildMarkStructure(content: Node[]) {
    return mergeMarks(
      content.map(node => {
        const nodeMarks = this.getMarks(node);
        if (nodeMarks.length === 0) {
          return node;
        }

        return nodeMarks.reverse().reduce((acc, mark) => {
          const { eq } = mark;

          return {
            ...mark,
            eq,
            content: [acc],
          };
        }, node as any);
      }),
    ) as Mark[];
  }

  // TODO: ED-9004 Remove unused ReactSerializer.fromSchema in renderer
  // https://sourcegraph-frontend.internal.shared-prod.us-west-2.kitt-inf.net/search?q=ReactSerializer.fromSchema&patternType=literal
  static fromSchema(_: unknown, init: ReactSerializerInit) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        'ReactSerializer.fromSchema is deprecated. Please use the constructor instead via new ReactSerializer()',
      );
    }
    return new ReactSerializer(init);
  }
}
