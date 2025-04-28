import React from 'react';

import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type {
	ExtractInjectionAPI,
	GetEditorFeatureFlags,
	getPosHandlerNode,
} from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { findTable } from '@atlaskit/editor-tables';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { TablePlugin } from '../tablePluginType';
import type { PluginInjectionAPI, TableSharedStateInternal } from '../types';

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

const useSharedTablePluginStateSelector = <K extends keyof TableSharedStateInternal>(
	api: ExtractInjectionAPI<TablePlugin> | undefined,
	key: K,
) => {
	const value = useSharedPluginStateSelector(api, `table.${key}` as never, {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	}) as TableSharedStateInternal[K];
	return value;
};

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
	const { widthState, tableState, mediaState, selectionState, editorViewModeState } =
		useSharedPluginState(api, ['width', 'table', 'media', 'selection', 'editorViewMode'], {
			disabled: editorExperiment('platform_editor_usesharedpluginstateselector', true),
		});

	const isTableResizingSelector = useSharedTablePluginStateSelector(api, 'isTableResizing');
	const isHeaderColumnEnabledSelector = useSharedTablePluginStateSelector(
		api,
		'isHeaderColumnEnabled',
	);
	const isHeaderRowEnabledSelector = useSharedTablePluginStateSelector(api, 'isHeaderRowEnabled');
	const orderingSelector = useSharedTablePluginStateSelector(api, 'ordering');
	const isResizingSelector = useSharedTablePluginStateSelector(api, 'isResizing');
	const isInDangerSelector = useSharedTablePluginStateSelector(api, 'isInDanger');
	const hoveredCellSelector = useSharedTablePluginStateSelector(api, 'hoveredCell');
	const hoveredRowsSelector = useSharedTablePluginStateSelector(api, 'hoveredRows');
	const isTableHoveredSelector = useSharedTablePluginStateSelector(api, 'isTableHovered');
	const isWholeTableInDangerSelector = useSharedTablePluginStateSelector(
		api,
		'isWholeTableInDanger',
	);

	// mediaState
	const isFullscreenSelector = useSharedPluginStateSelector(api, 'media.isFullscreen', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const isFullscreen = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isFullscreenSelector
		: mediaState?.isFullscreen;

	// selectionState
	const selectionSelector = useSharedPluginStateSelector(api, 'selection.selection', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const selection = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? selectionSelector
		: selectionState?.selection;

	// editorViewModeState
	const editorViewModeSelector = useSharedPluginStateSelector(api, 'editorViewMode.mode', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const mode = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? editorViewModeSelector
		: editorViewModeState?.mode;
	const isLivePageViewMode = mode === 'view';

	// widthState
	const widthSelector = useSharedPluginStateSelector(api, 'width.width', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const width = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? widthSelector
		: widthState?.width;

	const lineLengthSelector = useSharedPluginStateSelector(api, 'width.lineLength', {
		disabled: editorExperiment('platform_editor_usesharedpluginstateselector', false),
	});
	const lineLength = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? lineLengthSelector
		: widthState?.lineLength;

	if (editorExperiment('platform_editor_usesharedpluginstateselector', false) && !tableState) {
		return null;
	}

	// tableState
	const isTableResizing = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isTableResizingSelector
		: (tableState as TableSharedStateInternal).isTableResizing;
	const isHeaderColumnEnabled = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? isHeaderColumnEnabledSelector
		: (tableState as TableSharedStateInternal).isHeaderColumnEnabled;
	const isHeaderRowEnabled = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isHeaderRowEnabledSelector
		: (tableState as TableSharedStateInternal).isHeaderRowEnabled;
	const ordering = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? orderingSelector
		: (tableState as TableSharedStateInternal).ordering;
	const isResizing = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isResizingSelector
		: (tableState as TableSharedStateInternal).isResizing;
	const isInDanger = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isInDangerSelector
		: (tableState as TableSharedStateInternal).isInDanger;
	const hoveredCell = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? hoveredCellSelector
		: (tableState as TableSharedStateInternal).hoveredCell;
	const hoveredRows = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? hoveredRowsSelector
		: (tableState as TableSharedStateInternal).hoveredRows;
	const isTableHovered = editorExperiment('platform_editor_usesharedpluginstateselector', true)
		? isTableHoveredSelector
		: (tableState as TableSharedStateInternal).isTableHovered;
	const isWholeTableInDanger = editorExperiment(
		'platform_editor_usesharedpluginstateselector',
		true,
	)
		? isWholeTableInDangerSelector
		: (tableState as TableSharedStateInternal).isWholeTableInDanger;

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
			isHeaderRowEnabled={isHeaderRowEnabled}
			isHeaderColumnEnabled={isHeaderColumnEnabled}
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
