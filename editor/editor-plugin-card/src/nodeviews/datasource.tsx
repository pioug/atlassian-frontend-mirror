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
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  DatasourceAdf,
  DatasourceAdfView,
} from '@atlaskit/link-datasource';
import { DatasourceTableView } from '@atlaskit/link-datasource';

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

  private getTableView = (
    datasource?: DatasourceAdf['attrs']['datasource'],
  ) => {
    const views = (datasource || this.getDatasource())
      .views as DatasourceAdfView[];
    return views.find(view => view.type === 'table') || undefined;
  };

  handleColumnChange = (columnKeys: string[]) => {
    const { state, dispatch } = this.props.view;
    const pos = getPosSafely(this.props.getPos);
    if (pos === undefined) {
      return;
    }
    const attrs = this.props.node.attrs as DatasourceAdf['attrs'];
    const views = [
      {
        type: 'table',
        properties: { columns: columnKeys.map(key => ({ key })) },
      } as DatasourceAdfView,
    ];

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
  };

  onError = ({ err }: { err?: Error }) => {
    if (err) {
      throw err;
    }
  };

  render() {
    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;

    const datasource = this.getDatasource();
    const attrs = this.props.node.attrs as DatasourceAdf['attrs'];
    const tableView = this.getTableView();
    if (tableView) {
      const visibleColumnKeys = tableView.properties?.columns.map(
        ({ key }) => key,
      );

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

  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');
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
      >
        <div
          className={DATASOURCE_INNER_CONTAINER_CLASSNAME}
          style={{
            minWidth: calcBreakoutWidth(attrs.layout, this.tableWidth),
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
