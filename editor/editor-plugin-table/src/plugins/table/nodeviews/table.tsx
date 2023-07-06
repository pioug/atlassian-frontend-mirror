import React from 'react';
import {
  DOMOutputSpec,
  DOMSerializer,
  Node as PmNode,
} from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { PluginKey, EditorState } from 'prosemirror-state';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type {
  getPosHandler,
  getPosHandlerNode,
} from '@atlaskit/editor-common/types';

import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
} from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';

import { pluginConfig as getPluginConfig } from '../create-plugin-config';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey } from '../pm-plugins/plugin-key';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing';
import { generateColgroup } from '../pm-plugins/table-resizing/utils';
import { TableMap } from '@atlaskit/editor-tables/table-map';
import TableComponent from './TableComponent';
import { Props, TableOptions } from './types';
import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';

type ForwardRef = (node: HTMLElement | null) => void;

const tableAttributes = (node: PmNode) => {
  return {
    'data-number-column': node.attrs.isNumberColumnEnabled,
    'data-layout': node.attrs.layout,
    'data-autosize': node.attrs.__autoSize,
    'data-table-local-id': node.attrs.localId || '',
    'data-table-width': node.attrs.width,
  };
};

const toDOM = (node: PmNode, props: Props) => {
  let colgroup: DOMOutputSpec = '';

  if (props.allowColumnResizing) {
    colgroup = ['colgroup', {}, ...generateColgroup(node)];
  }

  return [
    'table',
    tableAttributes(node),
    colgroup,
    ['tbody', 0],
  ] as DOMOutputSpec;
};

export default class TableView extends ReactNodeView<Props> {
  private table: HTMLElement | undefined;
  private resizeObserver?: ResizeObserver;
  private tableRenderOptimization?: boolean;
  eventDispatcher?: EventDispatcher;

  getPos: getPosHandlerNode;

  constructor(props: Props) {
    super(
      props.node,
      props.view,
      props.getPos,
      props.portalProviderAPI,
      props.eventDispatcher,
      props,
      undefined,
      undefined,
      undefined,
      props.hasIntlContext,
    );
    this.getPos = props.getPos;
    this.tableRenderOptimization = props.tableRenderOptimization;
    this.eventDispatcher = props.eventDispatcher;
  }

  getContentDOM() {
    const rendered = DOMSerializer.renderSpec(
      document,
      toDOM(this.node, this.reactComponentProps as Props),
    ) as {
      dom: HTMLElement;
      contentDOM?: HTMLElement;
    };

    if (rendered.dom) {
      this.table = rendered.dom;
    }

    return rendered;
  }

  setDomAttrs(node: PmNode) {
    if (!this.table) {
      return;
    }

    const attrs = tableAttributes(node);
    (Object.keys(attrs) as Array<keyof typeof attrs>).forEach((attr) => {
      this.table!.setAttribute(attr, attrs[attr]);
    });
  }

  getNode = () => {
    return this.node;
  };

  render(props: Props, forwardRef: ForwardRef) {
    // TODO: ED-15663
    // Please, do not copy or use this kind of code below
    // @ts-ignore
    const fakePluginKey = {
      key: 'widthPlugin$',
      getState: (state: EditorState) => {
        return (state as any)['widthPlugin$'];
      },
    } as PluginKey;

    // TODO: ED-15663
    // Please, do not copy or use this kind of code below
    // @ts-ignore
    const fakeMediaPluginKey = {
      key: 'mediaPlugin$',
      getState: (state: EditorState) => {
        return (state as any)['mediaPlugin$'];
      },
    } as PluginKey;

    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
          tableResizingPluginState: tableResizingPluginKey,
          widthPlugin: fakePluginKey,
          mediaState: fakeMediaPluginKey,
        }}
        editorView={props.view}
        render={(pluginStates) => {
          const {
            tableResizingPluginState,
            pluginState,
            // containerWidth,
            mediaState,
          } = pluginStates;
          const tableActive = props.getPos() === pluginState!.tablePos;
          const containerWidth = props.getEditorContainerWidth();
          return (
            <TableComponent
              view={props.view}
              allowColumnResizing={props.allowColumnResizing}
              eventDispatcher={props.eventDispatcher}
              getPos={props.getPos}
              isMediaFullscreen={mediaState?.isFullscreen}
              options={props.options}
              allowControls={pluginState!.pluginConfig.allowControls!}
              isHeaderRowEnabled={pluginState!.isHeaderRowEnabled}
              isHeaderColumnEnabled={pluginState!.isHeaderColumnEnabled}
              tableActive={tableActive}
              ordering={pluginState!.ordering as TableColumnOrdering}
              tableResizingPluginState={tableResizingPluginState}
              getNode={this.getNode}
              containerWidth={containerWidth!}
              contentDOM={forwardRef}
              getEditorFeatureFlags={props.getEditorFeatureFlags}
            />
          );
        }}
      />
    );
  }

  private hasHoveredRows = false;
  viewShouldUpdate(nextNode: PmNode) {
    if (this.tableRenderOptimization) {
      const { hoveredRows } = getPluginState(this.view.state);
      const hoveredRowsChanged = !!hoveredRows?.length !== this.hasHoveredRows;
      if (nextNode.attrs.isNumberColumnEnabled && hoveredRowsChanged) {
        this.hasHoveredRows = !!hoveredRows?.length;
        return true;
      }

      const node = this.getNode();
      if (typeof node.attrs !== typeof nextNode.attrs) {
        return true;
      }
      const attrKeys = Object.keys(node.attrs);
      const nextAttrKeys = Object.keys(nextNode.attrs);
      if (attrKeys.length !== nextAttrKeys.length) {
        return true;
      }

      const tableMap = TableMap.get(node);
      const nextTableMap = TableMap.get(nextNode);

      if (tableMap.width !== nextTableMap.width) {
        return true;
      }

      return attrKeys.some((key) => {
        return node.attrs[key] !== nextNode.attrs[key];
      });
    }

    return super.viewShouldUpdate(nextNode);
  }

  ignoreMutation(
    mutation: MutationRecord | { type: 'selection'; target: Element },
  ) {
    const {
      type,
      target: { nodeName, firstChild },
    } = mutation;

    if (
      type === 'selection' &&
      nodeName?.toUpperCase() === 'DIV' &&
      firstChild?.nodeName.toUpperCase() === 'TABLE'
    ) {
      return false;
    }

    // ED-16668
    // Do not remove this fixes an issue with windows firefox that relates to
    // the addition of the shadow sentinels
    if (
      type === 'selection' &&
      nodeName?.toUpperCase() === 'TABLE' &&
      (firstChild?.nodeName.toUpperCase() === 'COLGROUP' ||
        firstChild?.nodeName.toUpperCase() === 'SPAN')
    ) {
      return false;
    }

    return true;
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.eventDispatcher?.emit('TABLE_DELETED', this.node);

    super.destroy();
  }
}

export const createTableView = (
  node: PmNode,
  view: EditorView,
  getPos: getPosHandler,
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  options: TableOptions,
  getEditorContainerWidth: GetEditorContainerWidth,
  getEditorFeatureFlags: GetEditorFeatureFlags,
): NodeView => {
  const { pluginConfig } = getPluginState(view.state);
  const { allowColumnResizing } = getPluginConfig(pluginConfig);
  const { tableRenderOptimization } = getEditorFeatureFlags();
  const hasIntlContext = true;

  return new TableView({
    node,
    view,
    allowColumnResizing,
    portalProviderAPI,
    eventDispatcher,
    getPos: getPos as getPosHandlerNode,
    options,
    tableRenderOptimization,
    getEditorContainerWidth,
    getEditorFeatureFlags,
    hasIntlContext,
  }).init();
};
