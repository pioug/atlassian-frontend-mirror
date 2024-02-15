import React, { useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type {
  DatasourceAdfView,
  JiraIssueDatasourceParameters,
} from '@atlaskit/link-datasource';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsConfigModal,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
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
  const existingNode =
    selection instanceof NodeSelection ? selection.node : undefined;
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
        updateCardViaDatasource(
          view.state,
          existingNode,
          newAdf,
          view,
          analyticEvent,
        );
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

    const visibleColumnKeys = tableView?.properties?.columns.map(
      column => column.key,
    );

    return (
      <div data-testid="jira-config-modal">
        <JiraIssuesConfigModal
          datasourceId={datasourceId}
          viewMode={isRegularCardNode ? 'count' : 'issue'} // Want non-datasource cards to open in count view since they are in issue count view
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters as JiraIssueDatasourceParameters}
          url={existingNode?.attrs.url}
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

  return null; // null for now until we have modal component that handles other datasources
};
