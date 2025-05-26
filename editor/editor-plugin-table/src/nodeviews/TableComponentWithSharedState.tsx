import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import {
	sharedPluginStateHookMigratorFactory,
	useSharedPluginState,
} from '@atlaskit/editor-common/hooks';
import type { GetEditorFeatureFlags, getPosHandlerNode } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';
import { useInternalTablePluginStateSelector } from '../ui/hooks/useInternalTablePluginStateSelector';

import TableComponent from './TableComponent';
import type { TableOptions } from './types';

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ForwardRef = (node: HTMLElement | null) => any;

type TableComponentWithSharedStateProps = {
	view: EditorView;
	options?: TableOptions;
	getNode: () => PmNode;
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	api?: PluginInjectionAPI;
	eventDispatcher: EventDispatcher;
	forwardRef: ForwardRef;
	getPos: getPosHandlerNode;
	allowColumnResizing?: boolean;
	allowControls?: boolean;
	allowTableAlignment?: boolean;
	allowTableResizing?: boolean;
};

const useSharedState = sharedPluginStateHookMigratorFactory(
	(api: PluginInjectionAPI | undefined) => {
		// tableState
		const isTableResizing = useInternalTablePluginStateSelector(api, 'isTableResizing');
		const isHeaderColumnEnabled = useInternalTablePluginStateSelector(api, 'isHeaderColumnEnabled');
		const isHeaderRowEnabled = useInternalTablePluginStateSelector(api, 'isHeaderRowEnabled');
		const ordering = useInternalTablePluginStateSelector(api, 'ordering');
		const isResizing = useInternalTablePluginStateSelector(api, 'isResizing');
		const isInDanger = useInternalTablePluginStateSelector(api, 'isInDanger');
		const hoveredCell = useInternalTablePluginStateSelector(api, 'hoveredCell');
		const hoveredRows = useInternalTablePluginStateSelector(api, 'hoveredRows');
		const isTableHovered = useInternalTablePluginStateSelector(api, 'isTableHovered');
		const isWholeTableInDanger = useInternalTablePluginStateSelector(api, 'isWholeTableInDanger');
		// Required so that table controls re-renders
		useInternalTablePluginStateSelector(api, 'targetCellPosition');

		// mediaState
		const isFullscreen = useSharedPluginStateSelector(api, 'media.isFullscreen');

		// selectionState
		const selection = useSharedPluginStateSelector(api, 'selection.selection');

		// editorViewModeState
		const mode = useSharedPluginStateSelector(api, 'editorViewMode.mode');

		// widthState
		const width = useSharedPluginStateSelector(api, 'width.width');
		const lineLength = useSharedPluginStateSelector(api, 'width.lineLength');

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
		};
	},
	(api: PluginInjectionAPI | undefined) => {
		const { widthState, tableState, mediaState, selectionState, editorViewModeState } =
			useSharedPluginState(api, ['width', 'table', 'media', 'selection', 'editorViewMode']);
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
	} = useSharedState(api);
	const isLivePageViewMode = mode === 'view';

	if (editorExperiment('platform_editor_usesharedpluginstateselector', false) && !tableState) {
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
			tableActive={tableActive && !isLivePageViewMode}
			ordering={ordering}
			isResizing={isResizing}
			getNode={getNode}
			containerWidth={
				editorExperiment('platform_editor_usesharedpluginstateselector', true)
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
