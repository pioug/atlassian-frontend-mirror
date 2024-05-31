import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import type {
	OptionalPlugin,
	PluginInjectionAPIWithDependencies,
} from '@atlaskit/editor-common/types';
import { todayTimestampInUTC } from '@atlaskit/editor-common/utils';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection, Selection } from '@atlaskit/editor-prosemirror/state';
import { canInsert } from '@atlaskit/editor-prosemirror/utils';

import { pluginKey } from './pm-plugins/plugin-key';
import type { DatePlugin, DeleteDate, InsertDate } from './types';
import { isToday } from './utils/internal';

type DeleteDateCommand = (
	pluginInjectionApi: PluginInjectionAPIWithDependencies<[DatePlugin]> | undefined,
) => DeleteDate;

/** Delete the date and close the datepicker */
export const deleteDateCommand: DeleteDateCommand =
	(pluginInjectionApi) =>
	({ tr }) => {
		const { showDatePickerAt } = pluginInjectionApi?.date?.sharedState.currentState() ?? {};
		if (!showDatePickerAt) {
			return tr;
		}

		tr.delete(showDatePickerAt, showDatePickerAt + 1).setMeta(pluginKey, {
			showDatePickerAt: null,
			isNew: false,
		});

		return tr;
	};

type InsertDateCommand = (
	pluginInjectionApi:
		| PluginInjectionAPIWithDependencies<[OptionalPlugin<AnalyticsPlugin>, DatePlugin]>
		| undefined,
) => InsertDate;

export const insertDateCommand: InsertDateCommand =
	(pluginInjectionApi) =>
	({ date, inputMethod, commitMethod, enterPressed = true }) =>
	({ tr }) => {
		const { schema } = tr.doc.type;
		let timestamp: string;
		if (date) {
			timestamp = Date.UTC(date.year, date.month - 1, date.day).toString();
		} else {
			timestamp = todayTimestampInUTC();
		}

		if (inputMethod) {
			pluginInjectionApi?.analytics?.actions?.attachAnalyticsEvent({
				action: ACTION.INSERTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				actionSubjectId: ACTION_SUBJECT_ID.DATE,
				eventType: EVENT_TYPE.TRACK,
				attributes: { inputMethod },
			})(tr);
		}

		if (commitMethod) {
			pluginInjectionApi?.analytics?.actions?.attachAnalyticsEvent({
				eventType: EVENT_TYPE.TRACK,
				action: ACTION.COMMITTED,
				actionSubject: ACTION_SUBJECT.DATE,
				attributes: {
					commitMethod,
					isValid: date !== undefined,
					isToday: isToday(date),
				},
			})(tr);
		}

		const { showDatePickerAt } = pluginInjectionApi?.date?.sharedState.currentState() ?? {};

		if (!showDatePickerAt) {
			const dateNode = schema.nodes.date.createChecked({
				timestamp,
			});
			const textNode = schema.text(' ');
			const fragment = Fragment.fromArray([dateNode, textNode]);
			const { from, to } = tr.selection;

			const insertable = canInsert(tr.selection.$from, fragment);
			if (!insertable) {
				const parentSelection = NodeSelection.create(
					tr.doc,
					tr.selection.from - tr.selection.$anchor.parentOffset - 1,
				);
				tr.insert(parentSelection.to, fragment).setSelection(
					NodeSelection.create(tr.doc, parentSelection.to + 1),
				);
			} else {
				tr.replaceWith(from, to, fragment).setSelection(NodeSelection.create(tr.doc, from));
			}
			if (tr.docChanged) {
				tr.scrollIntoView().setMeta(pluginKey, {
					isNew: true,
				});
			}
			return tr;
		}

		if (tr.doc.nodeAt(showDatePickerAt)) {
			if (enterPressed) {
				// Setting selection to outside the date node causes showDatePickerAt
				// to be set to null by the PM plugin (onSelectionChanged), which will
				// immediately close the datepicker once a valid date is typed in.
				// Adding this check forces it to stay open until the user presses Enter.
				tr = tr.setSelection(Selection.near(tr.doc.resolve(showDatePickerAt + 2)));
			}

			tr = tr
				.setNodeMarkup(showDatePickerAt, schema.nodes.date, {
					timestamp,
				})
				.setMeta(pluginKey, {
					isNew: false,
				})
				.scrollIntoView();

			if (!enterPressed) {
				tr = tr.setSelection(NodeSelection.create(tr.doc, showDatePickerAt));
			}
		}

		return tr;
	};
