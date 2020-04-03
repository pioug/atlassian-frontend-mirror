import React from 'react';
import { ComponentType } from 'react';
import { Fragment, Mark, MarkType, Node, Schema } from 'prosemirror-model';
import { Serializer } from '../';
import { RendererAppearance } from '../ui/Renderer/types';
import { AnalyticsEventPayload } from '../analytics/events';

import {
  Doc,
  mergeTextNodes,
  isTextWrapper,
  TextWrapper,
  toReact,
} from './nodes';

import { toReact as markToReact } from './marks';
import {
  ProviderFactory,
  getMarksByOrder,
  isSameMark,
  EventHandlers,
  ExtensionHandlers,
  calcTableColumnWidths,
} from '@atlaskit/editor-common';
import { getText } from '../utils';

export interface RendererContext {
  objectAri?: string;
  containerAri?: string;
  adDoc?: any;
  schema?: Schema;
}

export interface ConstructorParams {
  providers?: ProviderFactory;
  eventHandlers?: EventHandlers;
  extensionHandlers?: ExtensionHandlers;
  portal?: HTMLElement;
  objectContext?: RendererContext;
  appearance?: RendererAppearance;
  disableHeadingIDs?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: boolean;
  allowColumnSorting?: boolean;
  fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  shouldOpenMediaViewer?: boolean;
  allowAltTextOnImages?: boolean;
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

export default class ReactSerializer implements Serializer<JSX.Element> {
  private providers?: ProviderFactory;
  private eventHandlers?: EventHandlers;
  private extensionHandlers?: ExtensionHandlers;
  private portal?: HTMLElement;
  private rendererContext?: RendererContext;
  private appearance?: RendererAppearance;
  private disableHeadingIDs?: boolean;
  private headingIds: string[] = [];
  private allowDynamicTextSizing?: boolean;
  private allowHeadingAnchorLinks?: boolean;
  private allowColumnSorting?: boolean;
  private fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  private shouldOpenMediaViewer?: boolean;
  private allowAltTextOnImages?: boolean;

  constructor({
    providers,
    eventHandlers,
    extensionHandlers,
    portal,
    objectContext,
    appearance,
    disableHeadingIDs,
    allowDynamicTextSizing,
    allowHeadingAnchorLinks,
    allowColumnSorting,
    fireAnalyticsEvent,
    shouldOpenMediaViewer,
    allowAltTextOnImages,
  }: ConstructorParams) {
    this.providers = providers;
    this.eventHandlers = eventHandlers;
    this.extensionHandlers = extensionHandlers;
    this.portal = portal;
    this.rendererContext = objectContext;
    this.appearance = appearance;
    this.disableHeadingIDs = disableHeadingIDs;
    this.allowDynamicTextSizing = allowDynamicTextSizing;
    this.allowHeadingAnchorLinks = allowHeadingAnchorLinks;
    this.allowColumnSorting = allowColumnSorting;
    this.fireAnalyticsEvent = fireAnalyticsEvent;
    this.shouldOpenMediaViewer = shouldOpenMediaViewer;
    this.allowAltTextOnImages = allowAltTextOnImages;
  }

  private resetState() {
    this.headingIds = [];
  }

  serializeFragment(
    fragment: Fragment,
    props: any = {},
    target: any = Doc,
    key: string = 'root-0',
    parentInfo?: { parentIsIncompleteTask: boolean; path: Array<Node> },
  ): JSX.Element | null {
    // This makes sure that we reset internal state on re-render.
    if (key === 'root-0') {
      this.resetState();
    }

    const content = ReactSerializer.getChildNodes(fragment).map(
      (node, index) => {
        if (isTextWrapper(node)) {
          return this.serializeTextWrapper(node.content);
        }

        let props;

        if (node.type.name === 'table') {
          props = this.getTableProps(node);
        } else if (node.type.name === 'date') {
          props = this.getDateProps(node, parentInfo);
        } else if (node.type.name === 'heading') {
          props = this.getHeadingProps(node, parentInfo && parentInfo.path);
        } else if (['tableHeader', 'tableRow'].indexOf(node.type.name) > -1) {
          props = this.getTableChildrenProps(node);
        } else if (node.type.name === 'media') {
          props = this.getMediaProps(node, parentInfo && parentInfo.path);
        } else if (node.type.name === 'mediaSingle') {
          props = this.getMediaSingleProps(node, parentInfo && parentInfo.path);
        } else if (node.type.name === 'hardBreak') {
          props = this.getHardBreakProps(node, parentInfo && parentInfo.path);
        } else {
          props = this.getProps(node);
        }

        let currentPath = (parentInfo && parentInfo.path) || [];

        const parentIsIncompleteTask =
          node.type.name === 'taskItem' && node.attrs.state !== 'DONE';

        let pInfo = {
          parentIsIncompleteTask,
          path: [...currentPath, node],
        };

        const serializedContent = this.serializeFragment(
          node.content,
          props,
          toReact(node),
          `${node.type.name}-${index}`,
          pInfo,
        );

        if (node.marks && node.marks.length) {
          return ([] as Array<Mark>)
            .concat(node.marks)
            .reverse()
            .reduce((acc, mark) => {
              return this.renderMark(
                markToReact(mark),
                node.type.name === 'mediaSingle'
                  ? this.getMediaMarkProps(mark)
                  : this.getMarkProps(mark),
                `${mark.type.name}-${index}`,
                acc,
              );
            }, serializedContent);
        }

        return serializedContent;
      },
    );

    return this.renderNode(target, props, key, content);
  }

  private getMediaMarkProps = (mark: Mark) =>
    mark.type.name === 'link'
      ? {
          ...this.getMarkProps(mark),
          isMediaLink: true,
        }
      : this.getMarkProps(mark);

  private serializeTextWrapper(content: Node[]) {
    return ReactSerializer.buildMarkStructure(content).map((mark, index) =>
      this.serializeMark(mark, index),
    );
  }

  private serializeMark(mark: Mark, index: number = 0) {
    if (mark.type.name === 'text') {
      return (mark as any).text;
    }

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

  private getTableProps(node: Node) {
    return {
      ...this.getProps(node),
      allowColumnSorting: this.allowColumnSorting,
      columnWidths: calcTableColumnWidths(node),
      tableNode: node,
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
      isLinkMark,
      isInsideOfBlockNode,
    };
  }

  private getMediaProps(node: Node, path: Array<Node> = []) {
    return {
      ...this.getProps(node),
      shouldOpenMediaViewer: this.shouldOpenMediaViewer,
      allowAltTextOnImages: this.allowAltTextOnImages,
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

  private getProps(node: Node) {
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
      ...node.attrs,
    };
  }

  private headingAnchorSupported(path: Array<Node> = []): boolean {
    return (
      path.length === 0 || path[path.length - 1].type.name === 'layoutColumn'
    );
  }

  private getHeadingProps(node: Node, path: Array<Node> = []) {
    return {
      ...node.attrs,
      content: node.content ? node.content.toJSON() : undefined,
      headingId: this.getHeadingId(node),
      showAnchorLink:
        this.allowHeadingAnchorLinks &&
        !this.disableHeadingIDs &&
        this.headingAnchorSupported(path),
    };
  }

  // The return value of this function is NOT url encoded,
  // In HTML5 standard, id can contain any characters, encoding is no necessary.
  // Plus we trying to avoid double encoding, therefore we leave the value as is.
  // Remember to use encodeURIComponent when generating url from the id value.
  private getHeadingId(node: Node) {
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

    return this.getUniqueHeadingId(nodeContent);
  }

  private getUniqueHeadingId(baseId: string, counter = 0): string {
    if (counter === 0 && this.headingIds.indexOf(baseId) === -1) {
      this.headingIds.push(baseId);
      return baseId;
    } else if (counter !== 0) {
      const headingId = `${baseId}.${counter}`;
      if (this.headingIds.indexOf(headingId) === -1) {
        this.headingIds.push(headingId);
        return headingId;
      }
    }

    return this.getUniqueHeadingId(baseId, ++counter);
  }

  private getMarkProps(mark: Mark): any {
    const { key, ...otherAttrs } = mark.attrs;
    return {
      eventHandlers: this.eventHandlers,
      fireAnalyticsEvent: this.fireAnalyticsEvent,
      markKey: key,
      ...otherAttrs,
    };
  }

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

  static fromSchema(
    _schema: Schema,
    {
      providers,
      eventHandlers,
      extensionHandlers,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
      allowHeadingAnchorLinks,
      allowColumnSorting,
      shouldOpenMediaViewer,
    }: ConstructorParams,
  ): ReactSerializer {
    // TODO: Do we actually need the schema here?
    return new ReactSerializer({
      providers,
      eventHandlers,
      extensionHandlers,
      appearance,
      disableHeadingIDs,
      allowDynamicTextSizing,
      allowHeadingAnchorLinks,
      allowColumnSorting,
      shouldOpenMediaViewer,
    });
  }
}
