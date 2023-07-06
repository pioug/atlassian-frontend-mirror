import React, { useCallback } from 'react';
import { Node } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  DatasourceAdfView,
  JiraIssuesConfigModal,
} from '@atlaskit/link-datasource';
import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/smart-card';

import { hideDatasourceModal } from '../pm-plugins/actions';
import { updateExistingDatasource } from '../pm-plugins/doc';

type DatasourceModalProps = {
  state: EditorState;
  view: EditorView;
  node: Node;
  editorAnalyticsApi?: EditorAnalyticsAPI;
};

export const DatasourceModal = ({
  state,
  view,
  node,
}: DatasourceModalProps) => {
  const isJiraDatasource = node.attrs.datasource.parameters.jql;

  const onClose = useCallback(() => {
    view.dispatch(hideDatasourceModal(view.state.tr));
  }, [view]);

  const onInsert = useCallback(
    (newAdf: DatasourceAdf | InlineCardAdf) => {
      updateExistingDatasource(state, node, newAdf, view);
    },
    [state, node, view],
  );

  if (isJiraDatasource) {
    return (
      <div data-testId="jira-config-modal">
        <JiraIssuesConfigModal
          datasourceId={node.attrs.datasource.id}
          visibleColumnKeys={(
            node.attrs.datasource.views[0] as DatasourceAdfView
          )?.properties?.columns.map((column) => column.key)}
          parameters={node.attrs.datasource.parameters}
          onCancel={onClose}
          onInsert={onInsert}
        />
      </div>
    );
  }

  return null; // null for now until we have modal component that handles other datasources
};
