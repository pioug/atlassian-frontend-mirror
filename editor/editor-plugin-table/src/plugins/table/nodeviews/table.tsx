import React from 'react';

import type { TableColumnOrdering } from '@atlaskit/adf-schema/steps';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { getTableContainerWidth } from '@atlaskit/editor-common/node-width';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type {
  GetEditorContainerWidth,
  GetEditorFeatureFlags,
  getPosHandler,
  getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { WithPluginState } from '@atlaskit/editor-common/with-plugin-state';
import type {
  DOMOutputSpec,
  Node as PmNode,
} from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type {
  EditorState,
  PluginKey,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { akEditorTableNumberColumnWidth } from '@atlaskit/editor-shared-styles';
import { TableMap } from '@atlaskit/editor-tables/table-map';

import { pluginConfig as getPluginConfig } from '../create-plugin-config';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { pluginKey } from '../pm-plugins/plugin-key';
import { pluginKey as tableResizingPluginKey } from '../pm-plugins/table-resizing';
import { generateColgroup } from '../pm-plugins/table-resizing/utils';
import { pluginKey as tableWidthPluginKey } from '../pm-plugins/table-width';
import type { PluginInjectionAPI } from '../types';
import { isTableNested } from '../utils';

import TableComponent from './TableComponent';
import type { Props } from './types';

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

const getInlineWidth = (
  node: PmNode,
  options: Props['options'],
  state: EditorState,
  pos: number | undefined,
): number | undefined => {
  // provide a width for tables when custom table width is supported
  // this is to ensure 'responsive' tables (colgroup widths are undefined) become fixed to
  // support screen size adjustments
  const shouldHaveInlineWidth =
    options?.isTableResizingEnabled && !isTableNested(state, pos);

  let widthValue = getTableContainerWidth(node);

  if (node.attrs.isNumberColumnEnabled) {
    widthValue -= akEditorTableNumberColumnWidth;
  }

  return shouldHaveInlineWidth ? widthValue : undefined;
};

const handleInlineTableWidth = (
  table: HTMLElement,
  width: number | undefined,
) => {
  if (!table || !width) {
    return;
  }
  table.style.setProperty('width', `${width}px`);
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

    const tableInlineWidth = getInlineWidth(
      this.node,
      this.reactComponentProps.options,
      this.reactComponentProps.view.state,
      this.reactComponentProps.getPos(),
    );

    if (rendered.dom) {
      this.table = rendered.dom;
      if (tableInlineWidth) {
        handleInlineTableWidth(this.table, tableInlineWidth);
      }
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

    // handle inline style when table been resized
    const tableInlineWidth = getInlineWidth(
      node,
      (this.reactComponentProps as Props).options,
      this.view.state,
      this.getPos(),
    );

    const isTableResizing = tableWidthPluginKey.getState(
      this.view.state,
    )?.resizing;

    if (!isTableResizing && tableInlineWidth) {
      handleInlineTableWidth(this.table, tableInlineWidth);
    }
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
          tableWidthPluginState: tableWidthPluginKey,
          widthPlugin: fakePluginKey,
          mediaState: fakeMediaPluginKey,
        }}
        editorView={props.view}
        render={(pluginStates) => {
          const {
            tableResizingPluginState,
            tableWidthPluginState,
            pluginState,
            // containerWidth,
            mediaState,
          } = pluginStates;
          const containerWidth = props.getEditorContainerWidth();

          const isTableResizing = tableWidthPluginState?.resizing;
          const isResizing = Boolean(
            tableResizingPluginState?.dragging || isTableResizing,
          );

          /**
           *  ED-19810
           *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
           *  directly to confluence since this bug is now in production.
           */
          let tablePos: number | undefined;
          try {
            tablePos = props.getPos ? props.getPos() : undefined;
          } catch (e) {
            tablePos = undefined;
          }

          const tableActive =
            tablePos === pluginState!.tablePos && !isTableResizing;

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
              isResizing={isResizing}
              getNode={this.getNode}
              containerWidth={containerWidth!}
              contentDOM={forwardRef}
              getEditorFeatureFlags={props.getEditorFeatureFlags}
              pluginInjectionApi={props.pluginInjectionApi}
            />
          );
        }}
      />
    );
  }

  private hasHoveredRows = false;
  viewShouldUpdate(nextNode: PmNode) {
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
  getEditorContainerWidth: GetEditorContainerWidth,
  getEditorFeatureFlags: GetEditorFeatureFlags,
  pluginInjectionApi?: PluginInjectionAPI,
): NodeView => {
  const {
    pluginConfig,
    isBreakoutEnabled,
    isFullWidthModeEnabled,
    wasFullWidthModeEnabled,
    isTableResizingEnabled,
  } = getPluginState(view.state);
  const { allowColumnResizing } = getPluginConfig(pluginConfig);
  const hasIntlContext = true;

  return new TableView({
    node,
    view,
    allowColumnResizing,
    portalProviderAPI,
    eventDispatcher,
    getPos: getPos as getPosHandlerNode,
    options: {
      isBreakoutEnabled,
      isFullWidthModeEnabled,
      wasFullWidthModeEnabled,
      isTableResizingEnabled,
    },
    getEditorContainerWidth,
    getEditorFeatureFlags,
    hasIntlContext,
    pluginInjectionApi,
  }).init();
};
