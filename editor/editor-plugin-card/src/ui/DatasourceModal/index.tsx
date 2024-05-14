import React, { useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import {
  type EditorState,
  NodeSelection,
} from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import type {
  CardContext,
  DatasourceAdf,
  DatasourceAdfView,
  InlineCardAdf,
} from '@atlaskit/smart-card';

import { hideDatasourceModal } from '../../pm-plugins/actions';
import {
  insertDatasource,
  updateCardViaDatasource,
} from '../../pm-plugins/doc';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

import type { ModalTypeToComponentMap } from './ModalWithState';

type DatasourceModalProps = {
  view: EditorView;
  editorAnalyticsApi?: EditorAnalyticsAPI;
  cardContext?: CardContext;
} & ModalTypeToComponentMap;

export const DatasourceModal = ({
  view,
  cardContext,
  datasourceId: defaultDatasourceId,
  componentType: Component,
}: DatasourceModalProps) => {
  const { state } = view;

  const existingNode = getExistingNode(state);

  const {
    dispatch,
    state: { tr: transaction },
  } = view;
  const onClose = useCallback(() => {
    dispatch(hideDatasourceModal(transaction));
  }, [dispatch, transaction]);

  const onInsert = useOnInsert(view, existingNode);

  const isRegularCardNode = !!(
    existingNode && !existingNode?.attrs?.datasource
  );

  const {
    id: datasourceId = defaultDatasourceId,
    views = [],
    parameters: nodeParameters,
  } = existingNode?.attrs?.datasource || {};

  const { visibleColumnKeys, wrappedColumnKeys, columnCustomSizes } =
    resolveColumnsConfig(views);

  const { parameters, ready } = useFetchDatasourceInfo({
    isRegularCardNode,
    url: existingNode?.attrs.url,
    cardContext,
    nodeParameters,
  });

  if (!ready) {
    return null;
  }

  return (
    <Component
      datasourceId={datasourceId}
      viewMode={isRegularCardNode ? 'inline' : 'table'} // Want non-datasource cards to open in inline view since they are in table view
      parameters={parameters}
      url={existingNode?.attrs.url}
      visibleColumnKeys={visibleColumnKeys}
      columnCustomSizes={columnCustomSizes}
      wrappedColumnKeys={wrappedColumnKeys}
      onCancel={onClose}
      onInsert={onInsert}
    />
  );
};

const useOnInsert = (view: EditorView, existingNode: Node | undefined) => {
  return useCallback(
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
};

const getExistingNode = (state: EditorState): Node | undefined => {
  const { selection } = state;
  let existingNode: Node | undefined;
  if (
    getBooleanFF(
      'platform.linking-platform.enable-datasource-appearance-toolbar',
    )
  ) {
    // Check if the selection contains a link mark
    const isLinkMark = state.doc
      .resolve(selection.from)
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
  return existingNode;
};

const resolveColumnsConfig = (views: DatasourceAdfView[]) => {
  const [tableView] = views;

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

  return {
    visibleColumnKeys,
    wrappedColumnKeys,
    columnCustomSizes,
  };
};
