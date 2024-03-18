/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';
import PropTypes from 'prop-types';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import type {
  getPosHandler,
  ReactComponentProps,
} from '@atlaskit/editor-common/react-node-view';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import {
  DATASOURCE_INNER_CONTAINER_CLASSNAME,
  SmartCardSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { UnsupportedInline } from '@atlaskit/editor-common/ui';
import { calcBreakoutWidth } from '@atlaskit/editor-common/utils';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type {
  Decoration,
  DecorationSource,
  EditorView,
} from '@atlaskit/editor-prosemirror/view';
import type {
  DatasourceAdf,
  DatasourceAdfView,
} from '@atlaskit/link-datasource';
import { DatasourceTableView } from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { DatasourceErrorBoundary } from '../datasourceErrorBoundary';
import type { cardPlugin } from '../index';
import { EditorAnalyticsContext } from '../ui/EditorAnalyticsContext';

const getPosSafely = (pos: getPosHandler) => {
  if (!pos || typeof pos === 'boolean') {
    return;
  }
  try {
    return pos();
  } catch (e) {
    // Can blow up in rare cases, when node has been removed.
  }
};

export interface DatasourceProps extends ReactComponentProps {
  node: PMNode;
  view: EditorView;
  getPos: getPosHandler;
  portalProviderAPI: PortalProviderAPI;
  eventDispatcher: EventDispatcher;
  hasIntlContext: boolean;
  pluginInjectionApi: ExtractInjectionAPI<typeof cardPlugin> | undefined;
  isNodeNested?: boolean;
}

interface DatasourceComponentProps
  extends ReactComponentProps,
    Pick<DatasourceProps, 'node' | 'view' | 'getPos'> {}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class DatasourceComponent extends React.PureComponent<DatasourceComponentProps> {
  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  constructor(props: DatasourceComponentProps) {
    super(props);
  }

  private getDatasource = () =>
    (this.props.node.attrs as DatasourceAdf['attrs']).datasource;

  private getTableView = () => {
    const views = this.getDatasource().views as DatasourceAdfView[];
    return views.find(view => view.type === 'table') || undefined;
  };

  private updateTableProperties(
    columnKeysArg: string[],
    columnCustomSizes: { [key: string]: number },
    wrappedColumnKeys: string[],
  ) {
    const { state, dispatch } = this.props.view;
    const pos = getPosSafely(this.props.getPos);
    if (pos === undefined) {
      return;
    }

    // In case for some reason there are no visible keys stored in ADF, we take them
    // from incoming sets of attributes like column sizes and wrapped column keys
    // columnKeys are needed to update ADF (
    // since attributes (like custom width and wrapped state) only make sense for a visible column )
    // So this part effectively adds a visible column if it wasn't there but attributes were given.
    const columnKeys =
      columnKeysArg.length > 0
        ? columnKeysArg
        : Array.from(
            new Set([...Object.keys(columnCustomSizes), ...wrappedColumnKeys]),
          );

    const views = [
      {
        type: 'table',
        properties: {
          columns: columnKeys.map(key => {
            const width = columnCustomSizes[key];
            const isWrapped = wrappedColumnKeys.includes(key);
            return {
              key,
              ...(width ? { width } : {}),
              ...(isWrapped ? { isWrapped } : {}),
            };
          }),
        },
      } as DatasourceAdfView,
    ];
    const attrs = this.props.node.attrs as DatasourceAdf['attrs'];

    const tr = state.tr.setNodeMarkup(pos, undefined, {
      ...attrs,
      datasource: {
        ...attrs.datasource,
        views,
      },
    });

    // Ensures dispatch does not contribute to undo history (otherwise user requires three undo's to revert table)
    tr.setMeta('addToHistory', false);
    tr.setMeta('scrollIntoView', false);
    dispatch(tr);
  }

  handleColumnChange = (columnKeys: string[]) => {
    const { wrappedColumnKeys = [], columnCustomSizes = {} } =
      this.getColumnsInfo();
    this.updateTableProperties(
      columnKeys,
      columnCustomSizes,
      wrappedColumnKeys,
    );
  };

  handleColumnResize = (key: string, width: number) => {
    const {
      wrappedColumnKeys = [],
      columnCustomSizes = {},
      visibleColumnKeys = [],
    } = this.getColumnsInfo();
    const newColumnCustomSizes = { ...columnCustomSizes, [key]: width };
    this.updateTableProperties(
      visibleColumnKeys,
      newColumnCustomSizes,
      wrappedColumnKeys,
    );
  };

  handleWrappedColumnChange = (key: string, shouldWrap: boolean) => {
    const {
      wrappedColumnKeys = [],
      columnCustomSizes = {},
      visibleColumnKeys = [],
    } = this.getColumnsInfo();

    const wrappedColumnKeysSet = new Set(wrappedColumnKeys);
    if (shouldWrap) {
      wrappedColumnKeysSet.add(key);
    } else {
      wrappedColumnKeysSet.delete(key);
    }

    this.updateTableProperties(
      visibleColumnKeys,
      columnCustomSizes,
      Array.from(wrappedColumnKeysSet),
    );
  };

  onError = ({ err }: { err?: Error }) => {
    if (err) {
      throw err;
    }
  };

  private getColumnsInfo() {
    const tableView = this.getTableView();

    const columnsProp = tableView?.properties?.columns;
    const visibleColumnKeys = columnsProp?.map(({ key }) => key);

    let columnCustomSizes: { [key: string]: number } | undefined;
    const columnsWithWidth = columnsProp?.filter(
      (c): c is { key: string; width: number } => !!c.width,
    );
    if (columnsWithWidth) {
      const keyWidthPairs: [string, number][] = columnsWithWidth.map<
        [string, number]
      >(c => [c.key, c.width]);
      columnCustomSizes = Object.fromEntries<number>(keyWidthPairs);
    }

    const wrappedColumnKeys: string[] | undefined = columnsProp
      ?.filter(c => c.isWrapped)
      .map(c => c.key);

    return { visibleColumnKeys, columnCustomSizes, wrappedColumnKeys };
  }

  render() {
    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;

    const datasource = this.getDatasource();
    const attrs = this.props.node.attrs as DatasourceAdf['attrs'];
    const tableView = this.getTableView();

    if (tableView) {
      const { visibleColumnKeys, columnCustomSizes, wrappedColumnKeys } =
        this.getColumnsInfo();

      // [WS-2307]: we only render card wrapped into a Provider when the value is ready
      if (cardContext && cardContext.value) {
        return (
          <EditorAnalyticsContext editorView={this.props.view}>
            <cardContext.Provider value={cardContext.value}>
              <DatasourceTableView
                datasourceId={datasource.id}
                parameters={datasource.parameters}
                visibleColumnKeys={visibleColumnKeys}
                onVisibleColumnKeysChange={this.handleColumnChange}
                url={attrs?.url}
                onColumnResize={this.handleColumnResize}
                columnCustomSizes={columnCustomSizes}
                onWrappedColumnChange={
                  getBooleanFF('platform.linking-platform.datasource-word_wrap')
                    ? this.handleWrappedColumnChange
                    : undefined
                }
                wrappedColumnKeys={wrappedColumnKeys}
              />
            </cardContext.Provider>
          </EditorAnalyticsContext>
        );
      }
    }

    return null;
  }
}

export class Datasource extends ReactNodeView<DatasourceProps> {
  private tableWidth: number | undefined;
  private isNodeNested: boolean | undefined;

  constructor(props: DatasourceProps) {
    super(
      props.node,
      props.view,
      props.getPos,
      props.portalProviderAPI,
      props.eventDispatcher,
      props,
      undefined,
      true,
      undefined,
      props.hasIntlContext,
    );

    const sharedState = props?.pluginInjectionApi?.width?.sharedState;

    this.tableWidth = sharedState?.currentState()?.width;
    this.isNodeNested = props.isNodeNested;

    sharedState?.onChange(({ nextSharedState }) => {
      if (
        nextSharedState?.width &&
        this.tableWidth !== nextSharedState?.width
      ) {
        this.tableWidth = nextSharedState?.width;
        this.update(this.node, []); // required to update the width when page is resized.
      }
    });
  }

  // Need this function to check if the datasource attribute was added or not to a blockCard.
  // If not, we return false so we can get the node to re-render properly as a block node instead.
  // Otherwise, the node view will still consider the node as a Datasource and render a such.
  validUpdate(currentNode: PMNode, newNode: PMNode) {
    if (
      getBooleanFF(
        'platform.linking-platform.enable-datasource-appearance-toolbar',
      )
    ) {
      return !!newNode.attrs?.datasource;
    }
    return true;
  }

  update(
    node: PMNode,
    decorations: ReadonlyArray<Decoration>,
    _innerDecorations?: DecorationSource,
    validUpdate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
  ) {
    if (
      getBooleanFF(
        'platform.linking-platform.enable-datasource-appearance-toolbar',
      )
    ) {
      return super.update(
        node,
        decorations,
        _innerDecorations,
        this.validUpdate,
      );
    }
    return super.update(node, decorations, _innerDecorations, validUpdate);
  }

  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');

    domRef.setAttribute('contenteditable', 'true');
    domRef.classList.add(SmartCardSharedCssClassName.DATASOURCE_CONTAINER);
    return domRef;
  }

  render() {
    const { attrs } = this.node;

    return (
      <DatasourceErrorBoundary
        unsupportedComponent={UnsupportedInline}
        view={this.view}
        url={attrs.url}
        datasourceId={attrs?.datasource?.id}
      >
        <div
          className={DATASOURCE_INNER_CONTAINER_CLASSNAME}
          style={{
            minWidth: this.isNodeNested
              ? '100%'
              : calcBreakoutWidth(attrs.layout, this.tableWidth),
          }}
        >
          <DatasourceComponent
            node={this.node}
            view={this.view}
            getPos={this.getPos}
          />
        </div>
      </DatasourceErrorBoundary>
    );
  }
}
