import React, { useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import type { Node } from '@atlaskit/editor-prosemirror/dist/types/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  ConfluenceSearchDatasourceParameters,
  DatasourceAdfView,
  JiraIssueDatasourceParameters,
} from '@atlaskit/link-datasource';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsConfigModal,
  CONFLUENCE_SEARCH_DATASOURCE_ID,
  ConfluenceSearchConfigModal,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type {
  CardContext,
  DatasourceAdf,
  InlineCardAdf,
} from '@atlaskit/smart-card';

import { hideDatasourceModal } from '../../pm-plugins/actions';
import {
  insertDatasource,
  updateCardViaDatasource,
} from '../../pm-plugins/doc';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

type DatasourceModalProps = {
  view: EditorView;
  editorAnalyticsApi?: EditorAnalyticsAPI;
  modalType?: DatasourceModalType;
  cardContext?: CardContext;
};

export const DatasourceModal = ({
  view,
  modalType,
  cardContext,
}: DatasourceModalProps) => {
  const { dispatch, state } = view;
  const { selection } = state;

  let existingNode: Node | undefined;
  if (
    getBooleanFF(
      'platform.linking-platform.enable-datasource-appearance-toolbar',
    )
  ) {
    // Check if the selection contains a link mark
    const $pos = state.doc.resolve(selection.from);
    const isLinkMark = $pos
      .marks()
      .some(mark => mark.type === state.schema.marks.link);

    // When selection is a TextNode and a link Mark is present return that node
    if (selection instanceof NodeSelection) {
      existingNode = selection.node;
    } else if (isLinkMark) {
      existingNode = state.doc.nodeAt(selection.from) ?? undefined;
    }
  } else {
    existingNode =
      selection instanceof NodeSelection ? selection.node : undefined;
  }

  const isRegularCardNode = !!(
    existingNode && !existingNode?.attrs?.datasource
  );

  const { parameters, ready } = useFetchDatasourceInfo({
    isRegularCardNode,
    url: existingNode?.attrs.url,
    cardContext,
    nodeParameters: existingNode?.attrs?.datasource?.parameters,
  });

  const onClose = useCallback(() => {
    dispatch(hideDatasourceModal(view.state.tr));
  }, [dispatch, view.state.tr]);

  const onInsert = useCallback(
    (
      newAdf: DatasourceAdf | InlineCardAdf,
      analyticEvent?: UIAnalyticsEvent,
    ) => {
      if (analyticEvent) {
        analyticEvent.update(payload => ({
          ...payload,
          attributes: {
            ...payload.attributes,
            inputMethod: 'datasource_config',
          },
        }));
      }

      if (existingNode) {
        updateCardViaDatasource({
          state: view.state,
          node: existingNode,
          newAdf,
          view,
          sourceEvent: analyticEvent,
        });
      } else {
        insertDatasource(view.state, newAdf, view, analyticEvent);
      }
    },
    [existingNode, view],
  );

  if (modalType === 'jira') {
    if (!ready) {
      return null;
    }
    const { id: datasourceId = JIRA_LIST_OF_LINKS_DATASOURCE_ID, views = [] } =
      existingNode?.attrs?.datasource || {};

    const [tableView] = views as DatasourceAdfView[];

    const visibleColumnKeys: string[] = [];
    const wrappedColumnKeys: string[] = [];
    let columnCustomSizes: { [key: string]: number } | undefined;

    const columns = tableView?.properties?.columns;
    if (columns) {
      columnCustomSizes = {};
      for (const { key, width, isWrapped } of columns) {
        visibleColumnKeys.push(key);
        if (width) {
          columnCustomSizes[key] = width;
        }
        if (isWrapped) {
          wrappedColumnKeys.push(key);
        }
      }
    }

    return (
      <div data-testid="jira-config-modal">
        <JiraIssuesConfigModal
          datasourceId={datasourceId}
          viewMode={isRegularCardNode ? 'count' : 'issue'} // Want non-datasource cards to open in count view since they are in issue count view
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters as JiraIssueDatasourceParameters}
          url={existingNode?.attrs.url}
          columnCustomSizes={columnCustomSizes}
          wrappedColumnKeys={wrappedColumnKeys}
          onCancel={onClose}
          onInsert={onInsert}
        />
      </div>
    );
  }

  if (modalType === 'assets') {
    const {
      id: datasourceId = ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
      parameters,
      views = [],
    } = existingNode?.attrs?.datasource || {};

    const [tableView] = views as DatasourceAdfView[];

    const visibleColumnKeys = tableView?.properties?.columns.map(
      column => column.key,
    );

    return (
      <div data-testid="assets-config-modal">
        <AssetsConfigModal
          datasourceId={datasourceId}
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters}
          onCancel={onClose}
          onInsert={onInsert}
        />
      </div>
    );
  }

  // TODO: further refactor in https://product-fabric.atlassian.net/browse/EDM-9637
  if (modalType === 'confluence-search') {
    if (!ready) {
      return null;
    }
    const {
      id: datasourceId = CONFLUENCE_SEARCH_DATASOURCE_ID,
      parameters,
      views = [],
    } = existingNode?.attrs?.datasource || {};

    const [tableView] = views as DatasourceAdfView[];

    const visibleColumnKeys: string[] = [];
    const wrappedColumnKeys: string[] = [];
    let columnCustomSizes: { [key: string]: number } | undefined;

    const columns = tableView?.properties?.columns;
    if (columns) {
      columnCustomSizes = {};
      for (const { key, width, isWrapped } of columns) {
        visibleColumnKeys.push(key);
        if (width) {
          columnCustomSizes[key] = width;
        }
        if (isWrapped) {
          wrappedColumnKeys.push(key);
        }
      }
    }

    return (
      <div data-testid="confluence-search-config-modal">
        <ConfluenceSearchConfigModal
          datasourceId={datasourceId}
          viewMode={isRegularCardNode ? 'inline' : 'table'}
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters as ConfluenceSearchDatasourceParameters}
          url={existingNode?.attrs.url}
          columnCustomSizes={columnCustomSizes}
          wrappedColumnKeys={wrappedColumnKeys}
          onCancel={onClose}
          onInsert={onInsert}
        />
      </div>
    );
  }

  return null; // null for now until we have modal component that handles other datasources
};
