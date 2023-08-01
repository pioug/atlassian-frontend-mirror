/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';

import { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal-provider';
import ReactNodeView, {
  getPosHandler,
  ReactComponentProps,
} from '@atlaskit/editor-common/react-node-view';
import {
  DATASOURCE_INNER_CONTAINER_CLASSNAME,
  SmartCardSharedCssClassName,
} from '@atlaskit/editor-common/styles';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { calcBreakoutWidthPx } from '@atlaskit/editor-common/utils';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import {
  DatasourceAdf,
  DatasourceAdfView,
  DatasourceTableView,
} from '@atlaskit/link-datasource';

import type { cardPlugin } from '../index';
import { DatasourceTableLayout } from '../ui/LayoutButton/types';

const containerStyles = css({
  height: '500px',
  overflow: 'auto',
});

interface DatasourceProps extends ReactComponentProps {
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

  private getPosSafely = () => {
    const { getPos } = this.props;
    if (!getPos || typeof getPos === 'boolean') {
      return;
    }
    try {
      return getPos();
    } catch (e) {
      // Can blow up in rare cases, when node has been removed.
    }
  };

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
    const pos = this.getPosSafely();
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
    tr.setMeta('scrollIntoView', false);
    dispatch(tr);
  };

  render() {
    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;

    const datasource = this.getDatasource();
    const tableView = this.getTableView();
    if (tableView) {
      const visibleColumnKeys = tableView.properties?.columns.map(
        ({ key }) => key,
      );

      // [WS-2307]: we only render card wrapped into a Provider when the value is ready
      if (cardContext && cardContext.value) {
        return (
          <cardContext.Provider value={cardContext.value}>
            <DatasourceTableView
              datasourceId={datasource.id}
              parameters={datasource.parameters}
              visibleColumnKeys={visibleColumnKeys}
              onVisibleColumnKeysChange={this.handleColumnChange}
            />
          </cardContext.Provider>
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

    const sharedState =
      props?.pluginInjectionApi?.dependencies?.width?.sharedState;

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

  calcTableWidth = (
    layout: DatasourceTableLayout,
    containerWidth?: number,
  ): number | 'inherit' => {
    if (layout === 'center') {
      return 'inherit';
    }

    return calcBreakoutWidthPx(layout, containerWidth);
  };

  render() {
    const { attrs } = this.node;
    const calculatedWidth = this.calcTableWidth(attrs.layout, this.tableWidth);

    return (
      <div
        className={DATASOURCE_INNER_CONTAINER_CLASSNAME}
        css={containerStyles}
        style={{
          minWidth: calculatedWidth,
        }}
      >
        <DatasourceComponent
          node={this.node}
          view={this.view}
          getPos={this.getPos}
        />
      </div>
    );
  }
}
