import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	type INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
	getParentOfTypeCount,
	getPositionAfterTopParentNodeOfType,
} from '@atlaskit/editor-common/nesting';
import type { ExtractInjectionAPI, TypeAheadInsert } from '@atlaskit/editor-common/types';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { hasParentNodeOfType, safeInsert } from '@atlaskit/editor-prosemirror/utils';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';

import { pluginKey as sizeSelectorPluginKey } from '../../pm-plugins/table-size-selector';
import { createTableWithWidth } from '../../pm-plugins/utils/create';
import type { TablePlugin, TablePluginOptions } from '../../tablePluginType';

type InsertTableFromQuickInsertParams = {
	api: ExtractInjectionAPI<TablePlugin> | undefined;
	inputMethod:
		| INPUT_METHOD.ELEMENT_BROWSER
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.TOOLBAR;
	insert: TypeAheadInsert;
	isTableSelectorEnabled: boolean | undefined;
	options: TablePluginOptions;
	state: EditorState;
};

export const insertTableFromQuickInsert = ({
	api,
	inputMethod,
	insert,
	isTableSelectorEnabled,
	options,
	state,
}: InsertTableFromQuickInsertParams): Transaction => {
	if (isTableSelectorEnabled) {
		const tr = insert('');
		tr.setMeta(sizeSelectorPluginKey, {
			isSelectorOpen: true,
		});
		return tr;
	}

	const markdownState = api?.markdownMode?.sharedState.currentState();
	if (
		markdownState?.isMarkdownMode &&
		markdownState?.view === 'syntax' &&
		expValEqualsNoExposure('cc-markdown-mode', 'isEnabled', true) &&
		fg('platform_editor_markdown_compatible_toolbar')
	) {
		api?.markdownMode?.actions.insertSourceTable();
		return state.tr;
	}

	const tableState = api?.table?.sharedState.currentState();
	const tableNodeProps = {
		isTableScalingEnabled: options.isTableScalingEnabled,
		isTableAlignmentEnabled: options.tableOptions.allowTableAlignment,
		isFullWidthModeEnabled: tableState?.isFullWidthModeEnabled,
		isMaxWidthModeEnabled: tableState?.isMaxWidthModeEnabled,
		isCommentEditor: options.isCommentEditor,
		isChromelessEditor: options.isChromelessEditor,
		isTableResizingEnabled: options.tableOptions.allowTableResizing,
	};
	let tableNode = createTableWithWidth(tableNodeProps)(state.schema);
	let { tr } = state;

	if (
		hasParentNodeOfType(state.schema.nodes.table)(state.selection) &&
		options.tableOptions.allowNestedTables
	) {
		if (getParentOfTypeCount(state.schema.nodes.table)(state.selection.$from) > 1) {
			const positionAfterTopTable = getPositionAfterTopParentNodeOfType(state.schema.nodes.table)(
				state.selection.$from,
			);
			tr = safeInsert(tableNode, positionAfterTopTable)(tr);
			tr.scrollIntoView();
		} else {
			tableNode = createTableWithWidth({
				...tableNodeProps,
				isNestedTable: true,
			})(state.schema);
			tr = insert(tableNode);
		}
	} else {
		tr = insert(tableNode);
	}

	api?.analytics?.actions.attachAnalyticsEvent({
		action: ACTION.INSERTED,
		actionSubject: ACTION_SUBJECT.DOCUMENT,
		actionSubjectId: ACTION_SUBJECT_ID.TABLE,
		attributes: {
			inputMethod,
			localId: tableNode.attrs.localId,
			...(expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
				? { parentNode: tr.selection.$from.node(-1)?.type.name }
				: {}),
		},
		eventType: EVENT_TYPE.TRACK,
	})(tr);

	return tr;
};
