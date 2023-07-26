import React, { useCallback } from 'react';

import { NodeSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { DatasourceModalType } from '@atlaskit/editor-common/types';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsConfigModal,
  DatasourceAdfView,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/smart-card';

import { hideDatasourceModal } from '../../pm-plugins/actions';
import {
  insertDatasource,
  updateExistingDatasource,
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
    (newAdf: DatasourceAdf | InlineCardAdf) => {
      if (existingNode) {
        updateExistingDatasource(state, existingNode, newAdf, view);
      } else {
        insertDatasource(state, newAdf, view);
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
