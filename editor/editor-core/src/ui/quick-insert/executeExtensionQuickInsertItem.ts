import type React from 'react';

import type { EditorState, Selection, Transaction } from 'prosemirror-state';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	fireAnalyticsEvent,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import type { ExtensionAPI, MenuItem } from '@atlaskit/editor-common/extensions';
import { resolveImport } from '@atlaskit/editor-common/extensions';
import { logException } from '@atlaskit/editor-common/monitoring';
import {
	processRawFragmentValue,
	processRawValue,
} from '@atlaskit/editor-common/process-raw-value';
import type { QuickInsertActionInsert } from '@atlaskit/editor-common/provider-factory';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { findInsertLocation } from '@atlaskit/editor-common/utils/analytics';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { safeInsert, type NodeWithPos } from '@atlaskit/editor-prosemirror/utils';

import type EditorActions from '../../actions';

const sendAnalytics = (
	item: MenuItem,
	selection: Selection,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	source?:
		| INPUT_METHOD.TOOLBAR
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.ELEMENT_BROWSER,
) => {
	if (createAnalyticsEvent) {
		const insertLocation = findInsertLocation(selection);
		fireAnalyticsEvent(createAnalyticsEvent)({
			payload: {
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.EXTENSION,
				attributes: {
					extensionType: item.extensionType,
					extensionKey: item.extensionKey,
					key: item.key,
					inputMethod: source || INPUT_METHOD.QUICK_INSERT,
					...(insertLocation ? { insertLocation } : {}),
				},
				eventType: EVENT_TYPE.TRACK,
			},
		});
	}
};

const warnDummyAPI = (location: string) => {
	if (process.env.NODE_ENV !== 'production') {
		// eslint-disable-next-line no-console
		console.warn(
			'Extension plugin not attached to editor - cannot use extension API in ' + location,
		);
	}
};

const dummyExtensionAPI: ExtensionAPI = {
	editInContextPanel: () => warnDummyAPI('editInContextPanel'),
	_editInLegacyMacroBrowser: () => warnDummyAPI('_editInLegacyMacroBrowser'),
	getNodeWithPosByLocalId: () => ({ node: null, pos: null }) as unknown as NodeWithPos,
	doc: {
		insertAfter: () => warnDummyAPI('doc:insertAfter'),
		scrollTo: () => warnDummyAPI('doc:scrollTo'),
		update: () => warnDummyAPI('doc:update'),
	},
};

export const executeExtensionQuickInsertItem = ({
	apiRef,
	createAnalyticsEvent,
	editorActions,
	insert,
	item,
	source,
	state,
}: {
	apiRef: React.MutableRefObject<PublicPluginAPI<[ExtensionPlugin]> | undefined>;
	createAnalyticsEvent?: CreateUIAnalyticsEvent;
	editorActions: EditorActions;
	insert: QuickInsertActionInsert;
	item: MenuItem;
	source?:
		| INPUT_METHOD.TOOLBAR
		| INPUT_METHOD.INSERT_MENU
		| INPUT_METHOD.QUICK_INSERT
		| INPUT_METHOD.ELEMENT_BROWSER;
	state: EditorState;
}): Transaction | false => {
	if (typeof item.node === 'function') {
		const extensionAPI = apiRef.current?.extension?.actions?.api() ?? dummyExtensionAPI;
		void resolveImport(item.node(extensionAPI))
			.then((node) => {
				sendAnalytics(item, state.selection, createAnalyticsEvent, source);
				if (node) {
					const api = apiRef.current;
					if (!api) {
						editorActions.replaceSelection(node);
						return;
					}

					api.core.actions.execute(({ tr }) => {
						const content = Array.isArray(node)
							? processRawFragmentValue(tr.doc.type.schema, node)
							: processRawValue(tr.doc.type.schema, node);
						return content ? safeInsert(content)(tr).scrollIntoView() : null;
					});
				}
			})
			.catch((error) =>
				logException(error, {
					location: 'editor-core/quick-insert',
				}),
			);
		return insert('');
	}

	sendAnalytics(item, state.selection, createAnalyticsEvent, source);
	return insert(item.node);
};
