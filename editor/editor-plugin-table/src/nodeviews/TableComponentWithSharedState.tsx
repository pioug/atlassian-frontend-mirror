import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	type NamedPluginStatesFromInjectionAPI,
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
	useSharedPluginStateWithSelector,
} from '@atlaskit/editor-common/hooks';
import type {
	ExtractInjectionAPI,
	GetEditorFeatureFlags,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type tablePlugin from '../tablePlugin';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';

import TableComponent from './TableComponent';
import type { TableOptions } from './types';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ForwardRef = (node: HTMLElement | null) => any;

type TableComponentWithSharedStateProps = {
	allowColumnResizing?: boolean;
	allowControls?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
	api?: PluginInjectionAPI;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	eventDispatcher: EventDispatcher;
	forwardRef: ForwardRef;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	getNode: () => PmNode;
	getPos: getPosHandlerNode;
	options?: TableOptions;
	view: EditorView;
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: PluginInjectionAPI | undefined) => {
		const {
			isTableResizing,
			isHeaderColumnEnabled,
			isHeaderRowEnabled,
			ordering,
			isResizing,
			isInDanger,
			hoveredCell,
			hoveredRows,
			isTableHovered,
			isWholeTableInDanger,
			interaction,
			isFullscreen,
			lineLength,
			mode,
			selection,
			width,
		} = useSharedPluginStateWithSelector(
			api,
			['table', 'width', 'media', 'selection', 'editorViewMode', 'interaction'],
			(
				states: NamedPluginStatesFromInjectionAPI<
					ExtractInjectionAPI<typeof tablePlugin>,
					'width' | 'media' | 'selection' | 'editorViewMode' | 'interaction'
				> & {
					tableState: TableSharedStateInternal | undefined;
				},
			) => ({
				// tableState
				isTableResizing: states.tableState?.isTableResizing,
				isHeaderColumnEnabled: states.tableState?.isHeaderColumnEnabled,
				isHeaderRowEnabled: states.tableState?.isHeaderRowEnabled,
				ordering: states.tableState?.ordering,
				isResizing: states.tableState?.isResizing,
				isInDanger: states.tableState?.isInDanger,
				hoveredCell: states.tableState?.hoveredCell,
				hoveredRows: states.tableState?.hoveredRows,
				isTableHovered: states.tableState?.isTableHovered,
				isWholeTableInDanger: states.tableState?.isWholeTableInDanger,
				// Required so that table control re-renders
				targetCellPosition: states.tableState?.targetCellPosition,
				// mediaState
				isFullscreen: states.mediaState?.isFullscreen,
				// selectionState
				selection: states.selectionState?.selection,
				// editorViewModeState
				mode: states.editorViewModeState?.mode,
				// widthState
				width: states.widthState?.width,
				lineLength: states.widthState?.lineLength,
				// interactionState
				interaction: states.interactionState?.interactionState,
			}),
		);

		return {
			tableState: undefined,
			widthState: undefined,
			isTableResizing,
			isHeaderColumnEnabled,
			isHeaderRowEnabled,
			ordering,
			isResizing,
			isInDanger,
			hoveredCell,
			hoveredRows,
			isTableHovered,
			isWholeTableInDanger,
			isFullscreen,
			selection,
			mode,
			width,
			lineLength,
			interaction,
		};
	},
	(api: PluginInjectionAPI | undefined) => {
		const {
			widthState,
			tableState,
			mediaState,
			selectionState,
			editorViewModeState,
			interactionState,
		} = useSharedPluginState(api, [
			'width',
			'table',
			'media',
			'selection',
			'editorViewMode',
			'interaction',
		]);
		const tableStateInternal = tableState as TableSharedStateInternal | undefined;

		return {
			tableState,
			widthState,
			isTableResizing: tableStateInternal?.isTableResizing,
			isHeaderColumnEnabled: tableStateInternal?.isHeaderColumnEnabled,
			isHeaderRowEnabled: tableStateInternal?.isHeaderRowEnabled,
			ordering: tableStateInternal?.ordering,
			isResizing: tableStateInternal?.isResizing,
			isInDanger: tableStateInternal?.isInDanger,
			hoveredCell: tableStateInternal?.hoveredCell,
			hoveredRows: tableStateInternal?.hoveredRows,
			isTableHovered: tableStateInternal?.isTableHovered,
			isWholeTableInDanger: tableStateInternal?.isWholeTableInDanger,
			isFullscreen: mediaState?.isFullscreen,
			selection: selectionState?.selection,
			mode: editorViewModeState?.mode,
			width: widthState?.width,
			lineLength: widthState?.lineLength,
			interaction: interactionState?.interactionState,
		};
	},
);

/**
 * Use useSharedPluginState to control re-renders from plugin dependencies
 */
export const TableComponentWithSharedState = ({
	view,
	options,
	getNode,
	dispatchAnalyticsEvent,
	api,
	getEditorFeatureFlags,
	eventDispatcher,
	allowColumnResizing,
	allowControls,
	getPos,
	forwardRef,
	allowTableAlignment,
	allowTableResizing,
}: TableComponentWithSharedStateProps) => {
	const {
		tableState,
		widthState,
		mode,
		hoveredCell,
		hoveredRows,
		isFullscreen,
		isHeaderColumnEnabled,
		isHeaderRowEnabled,
		isInDanger,
		isResizing,
		isTableHovered,
		isTableResizing,
		isWholeTableInDanger,
		lineLength,
		ordering,
		selection,
		width,
		interaction,
	} = useSharedState(api);

	const isLivePageViewMode = mode === 'view';

	if (
		expValEquals('platform_editor_usesharedpluginstatewithselector', 'isEnabled', false) &&
		!tableState
	) {
		return null;
	}

	/**
	 *  ED-19810
	 *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
	 *  directly to confluence since this bug is now in production.
	 */
	let currentTablePos: number | undefined;
	try {
		currentTablePos = getPos ? getPos() : undefined;
	} catch (e) {
		currentTablePos = undefined;
	}

	const selectedTable = findTable(view.state.selection);

	const tablePos = selectedTable && selectedTable.start - 1;

	const tableActive =
		typeof currentTablePos === 'number' &&
		typeof tablePos === 'number' &&
		currentTablePos === tablePos &&
		!isTableResizing;

	return (
		<TableComponent
			view={view}
			allowColumnResizing={allowColumnResizing}
			eventDispatcher={eventDispatcher}
			getPos={getPos}
			isMediaFullscreen={isFullscreen}
			options={options}
			allowControls={allowControls}
			isHeaderRowEnabled={isHeaderRowEnabled ?? false}
			isHeaderColumnEnabled={isHeaderColumnEnabled ?? false}
			isDragAndDropEnabled={options?.isDragAndDropEnabled && !isLivePageViewMode}
			isTableScalingEnabled={options?.isTableScalingEnabled}
			allowTableAlignment={allowTableAlignment}
			allowTableResizing={allowTableResizing}
			tableActive={tableActive && !isLivePageViewMode && interaction !== 'hasNotHadInteraction'}
			ordering={ordering}
			isResizing={isResizing}
			getNode={getNode}
			containerWidth={
				editorExperiment('platform_editor_usesharedpluginstatewithselector', true)
					? {
							width: width ?? 0,
							lineLength,
						}
					: // Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						widthState!
			}
			contentDOM={forwardRef}
			getEditorFeatureFlags={getEditorFeatureFlags}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			pluginInjectionApi={api}
			isInDanger={!!isInDanger}
			hoveredRows={hoveredRows}
			hoveredCell={hoveredCell}
			isTableHovered={isTableHovered}
			isWholeTableInDanger={isWholeTableInDanger}
			selection={selection}
		/>
	);
};
