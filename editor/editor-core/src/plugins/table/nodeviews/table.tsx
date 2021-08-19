import React from 'react';
import {
  DOMOutputSpec,
  DOMSerializer,
  Node as PmNode,
} from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { EventDispatcher } from '../../../event-dispatcher';
import {
  ForwardRef,
  getPosHandler,
  getPosHandlerNode,
} from '../../../nodeviews';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { pluginConfig as getPluginConfig } from '../create-plugin-config';
import { getPluginState, pluginKey } from '../pm-plugins/plugin-factory';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing';
import { generateColgroup } from '../pm-plugins/table-resizing/utils';

import TableComponent from './TableComponent';
import { Props, TableOptions } from './types';
import { setTableSize } from '../commands';
import { getFeatureFlags } from '../../feature-flags-context';
import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';
import { EmitterEvents } from '../../../extensibility';

const tableAttributes = (node: PmNode) => {
  return {
    'data-number-column': node.attrs.isNumberColumnEnabled,
    'data-layout': node.attrs.layout,
    'data-autosize': node.attrs.__autoSize,
    'data-table-local-id': node.attrs.localId || '',
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
  private editorView: EditorView;
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
    );
    this.getPos = props.getPos;
    this.editorView = props.view;
    this.tableRenderOptimization = props.tableRenderOptimization;
    this.eventDispatcher = props.eventDispatcher;
  }

  getContentDOM() {
    const rendered = DOMSerializer.renderSpec(
      document,
      toDOM(this.node, this.reactComponentProps as Props),
    );

    if (rendered.dom) {
      this.table = rendered.dom as HTMLElement;
    }

    if (
      this.tableRenderOptimization &&
      this.table &&
      !this.resizeObserver &&
      window?.ResizeObserver
    ) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const height = entry.contentRect
            ? entry.contentRect.height
            : (entry.target as HTMLElement).offsetHeight;
          const width = entry.contentRect
            ? entry.contentRect.width
            : (entry.target as HTMLElement).offsetWidth;
          setTableSize(height, width)(
            this.editorView.state,
            this.editorView.dispatch,
          );
        }
      });
      this.resizeObserver.observe(this.table);
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
    return (
      <WithPluginState
        plugins={{
          containerWidth: widthPluginKey,
          pluginState: pluginKey,
          tableResizingPluginState: tableResizingPluginKey,
        }}
        editorView={props.view}
        render={(pluginStates) => {
          const {
            tableResizingPluginState,
            pluginState,
            containerWidth,
          } = pluginStates;
          const tableActive = props.getPos() === pluginState!.tablePos;
          return (
            <TableComponent
              view={props.view}
              allowColumnResizing={props.allowColumnResizing}
              eventDispatcher={props.eventDispatcher}
              getPos={props.getPos}
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
      return attrKeys.some((key) => {
        return node.attrs[key] !== nextNode.attrs[key];
      });
    }

    return super.viewShouldUpdate(nextNode);
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    this.eventDispatcher?.emit(EmitterEvents.TABLE_DELETED, this.node);

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
): NodeView => {
  const { pluginConfig } = getPluginState(view.state);
  const { allowColumnResizing } = getPluginConfig(pluginConfig);
  const { tableRenderOptimization } = getFeatureFlags(view.state) || {};
  return new TableView({
    node,
    view,
    allowColumnResizing,
    portalProviderAPI,
    eventDispatcher,
    getPos: getPos as getPosHandlerNode,
    options,
    tableRenderOptimization,
  }).init();
};
