import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { GetEditorContainerWidth, GetEditorFeatureFlags } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { isAnchorSupported } from '../pm-plugins/utils/anchor';
import type { PluginInjectionAPI } from '../types';

// TODO: ED-23976 - Clean up
import { createTableView } from './table';
import TableCell from './TableCell';
import TableRow from './TableRow';
import TableRowNativeStickyWithFallback from './TableRowNativeStickyWithFallback';

type TableViewOptions = {
	dispatchAnalyticsEvent: DispatchAnalyticsEvent;
	eventDispatcher: EventDispatcher;
	getEditorContainerWidth: GetEditorContainerWidth;
	getEditorFeatureFlags: GetEditorFeatureFlags;
	isChromelessEditor?: boolean;
	isCommentEditor?: boolean;
	pluginInjectionApi?: PluginInjectionAPI;
	portalProviderAPI: PortalProviderAPI;
};

export const tableView = (options: TableViewOptions) => {
	return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		return createTableView(
			node,
			view,
			getPos,
			options.portalProviderAPI,
			options.eventDispatcher,
			options.getEditorContainerWidth,
			options.getEditorFeatureFlags,
			options.dispatchAnalyticsEvent,
			options.pluginInjectionApi,
			options.isCommentEditor,
			options.isChromelessEditor,
		);
	};
};

type TableCellViewOptions = {
	eventDispatcher: EventDispatcher;
	pluginInjectionApi?: PluginInjectionAPI;
};
export const tableCellView = (options: TableCellViewOptions) => {
	return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		return new TableCell(
			node,
			view,
			getPos,
			options.eventDispatcher,
			options.pluginInjectionApi?.analytics?.actions,
		);
	};
};

export const tableHeaderView = (options: TableCellViewOptions) => {
	return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		return new TableCell(
			node,
			view,
			getPos,
			options.eventDispatcher,
			options.pluginInjectionApi?.analytics?.actions,
		);
	};
};

export const tableRowView = (options: TableCellViewOptions) => {
	return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
		if (
			isAnchorSupported() &&
			expValEquals('platform_editor_native_anchor_with_dnd', 'isEnabled', true) &&
			expValEquals(
				'platform_editor_table_sticky_header_improvements',
				'cohort',
				'test_with_overflow',
			)
		) {
			return new TableRowNativeStickyWithFallback(
				node,
				view,
				getPos,
				options.eventDispatcher,
				options.pluginInjectionApi,
			);
		} else {
			return new TableRow(node, view, getPos, options.eventDispatcher, options.pluginInjectionApi);
		}
	};
};
