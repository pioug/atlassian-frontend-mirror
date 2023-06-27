/** @jsx jsx */
import React from 'react';
import PropTypes from 'prop-types';
import { css, jsx } from '@emotion/react';

import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import ReactNodeView, {
  getPosHandler,
  ReactComponentProps,
} from '@atlaskit/editor-common/react-node-view';

import {
  DatasourceAdf,
  DatasourceAdfView,
  DatasourceTableView,
} from '@atlaskit/link-datasource';

const containerStyles = css({
  height: '500px',
  overflow: 'auto',
});

interface DatasourceComponentProps extends ReactComponentProps {
  node: PMNode;
  view: EditorView;
  getPos: getPosHandler;
}

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
    return views.find((view) => view.type === 'table') || undefined;
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
        properties: { columns: columnKeys.map((key) => ({ key })) },
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

export class Datasource extends ReactNodeView<DatasourceComponentProps> {
  render() {
    return (
      <div css={containerStyles}>
        <DatasourceComponent
          node={this.node}
          view={this.view}
          getPos={this.getPos}
        />
      </div>
    );
  }
}
