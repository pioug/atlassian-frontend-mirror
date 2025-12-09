import React, { useCallback } from 'react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Node } from '@atlaskit/editor-prosemirror/model';
import { type EditorState, NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { CardContext } from '@atlaskit/link-provider';
import type { DatasourceAdf, DatasourceAdfView, InlineCardAdf } from '@atlaskit/linking-common';

import { hideDatasourceModal } from '../../pm-plugins/actions';
import { insertDatasource, updateCardViaDatasource } from '../../pm-plugins/doc';
import { useFetchDatasourceInfo } from '../useFetchDatasourceInfo';

import type { ModalTypeToComponentMap } from './ModalWithState';

type DatasourceModalProps = {
	cardContext?: CardContext;
	editorAnalyticsApi?: EditorAnalyticsAPI;
	view: EditorView;
} & ModalTypeToComponentMap;

export const DatasourceModal = ({
	view,
	cardContext,
	datasourceId: defaultDatasourceId,
	componentType: Component,
}: DatasourceModalProps): React.JSX.Element | null => {
	const { state } = view;

	const existingNode = getExistingNode(state);

	const {
		dispatch,
		state: { tr: transaction },
	} = view;
	const onClose = useCallback(() => {
		dispatch(hideDatasourceModal(transaction));
	}, [dispatch, transaction]);

	const updateAdf = useUpdateAdf(view, existingNode);

	const isRegularCardNode = !!(existingNode && !existingNode?.attrs?.datasource);

	const {
		id: datasourceId = defaultDatasourceId,
		views = [],
		parameters: nodeParameters,
	} = existingNode?.attrs?.datasource || {};

	const { visibleColumnKeys, wrappedColumnKeys, columnCustomSizes } = resolveColumnsConfig(views);

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
			onInsert={updateAdf}
		/>
	);
};

const useUpdateAdf = (view: EditorView, existingNode: Node | undefined) => {
	return useCallback(
		(newAdf: DatasourceAdf | InlineCardAdf, analyticEvent?: UIAnalyticsEvent) => {
			if (analyticEvent) {
				analyticEvent.update((payload) => ({
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
	// Check if the selection contains a link mark
	const isLinkMark = state.doc
		.resolve(selection.from)
		.marks()
		.some((mark) => mark.type === state.schema.marks.link);

	// When selection is a TextNode and a link Mark is present return that node
	if (selection instanceof NodeSelection) {
		existingNode = selection.node;
	} else if (isLinkMark) {
		existingNode = state.doc.nodeAt(selection.from) ?? undefined;
	}
	return existingNode;
};

const resolveColumnsConfig = (views: DatasourceAdfView[]) => {
	const [tableView] = views;

	const visibleColumnKeys: string[] = [];
	const wrappedColumnKeys: string[] = [];
	const columnCustomSizes: { [key: string]: number } = {};

	const columns = tableView?.properties?.columns;
	if (columns) {
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
