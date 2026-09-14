import type { PanelAttributes } from '@atlaskit/adf-schema/panel';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { createWrapSelectionTransaction } from '@atlaskit/editor-common/utils';
import { pickPanelTypeForInsertion } from '@atlaskit/editor-common/utils/node-type-utils';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import type { PanelPlugin } from '../../panelPluginType';

export const createPanelAction = ({
	state,
	attributes,
	api,
	typeAheadInsert,
	inputMethod = INPUT_METHOD.QUICK_INSERT,
}: {
	api: ExtractInjectionAPI<PanelPlugin> | undefined;
	attributes: PanelAttributes;
	inputMethod?:
		| INPUT_METHOD.ELEMENT_BROWSER
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.TOOLBAR;
	state: EditorState;
	typeAheadInsert?: QuickInsertActionInsert;
}): ReturnType<QuickInsertActionInsert> | false => {
	const panelNodeType = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? pickPanelTypeForInsertion(state.selection.$from)
		: state.schema.nodes.panel;
	let tr;
	if (state.selection.empty) {
		const node = panelNodeType.createAndFill({ ...attributes });

		if (!node) {
			return false;
		}

		tr = typeAheadInsert
			? typeAheadInsert(node)
			: insertSelectedItem(node)(state, state.tr, state.selection.head)?.scrollIntoView();
	} else {
		tr = createWrapSelectionTransaction({
			state,
			type: panelNodeType,
			nodeAttributes: { ...attributes },
		});
	}

	if (tr) {
		api?.analytics?.actions.attachAnalyticsEvent({
			action: ACTION.INSERTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			actionSubjectId: ACTION_SUBJECT_ID.PANEL,
			attributes: { inputMethod, panelType: attributes.panelType },
			eventType: EVENT_TYPE.TRACK,
		})(tr);
	}
	return tr ?? false;
};
