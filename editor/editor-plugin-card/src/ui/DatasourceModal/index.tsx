import React, { useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { DatasourceModalType } from '@atlaskit/editor-common/types';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { DatasourceAdfView } from '@atlaskit/link-datasource';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsConfigModal,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/smart-card';

import { hideDatasourceModal } from '../../pm-plugins/actions';
import {
  insertDatasource,
  updateCardFromDatasourceModal,
} from '../../pm-plugins/doc';

type DatasourceModalProps = {
  view: EditorView;
  editorAnalyticsApi?: EditorAnalyticsAPI;
  modalType?: DatasourceModalType;
};

export const DatasourceModal = ({ view, modalType }: DatasourceModalProps) => {
  const { dispatch, state } = view;
  const { selection } = state;
  const existingNode =
    selection instanceof NodeSelection ? selection.node : undefined;

  const onClose = useCallback(() => {
    dispatch(hideDatasourceModal(state.tr));
  }, [dispatch, state.tr]);

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
        updateCardFromDatasourceModal(
          state,
          existingNode,
          newAdf,
          view,
          analyticEvent,
        );
      } else {
        insertDatasource(state, newAdf, view, analyticEvent);
      }
    },
    [existingNode, state, view],
  );

  if (modalType === 'jira') {
    const {
      id: datasourceId = JIRA_LIST_OF_LINKS_DATASOURCE_ID,
      parameters,
      views = [],
    } = existingNode?.attrs?.datasource || {};

    const [tableView] = views as DatasourceAdfView[];

    const visibleColumnKeys = tableView?.properties?.columns.map(
      column => column.key,
    );

    return (
      <div data-testid="jira-config-modal">
        <JiraIssuesConfigModal
          datasourceId={datasourceId}
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters}
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
