import React from 'react';

import Loadable from 'react-loadable';

import type { WeekDay } from '@atlaskit/calendar/types';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import {
	annotationMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { IconDate } from '@atlaskit/editor-common/quick-insert';
import { DateSharedCssClassName } from '@atlaskit/editor-common/styles';
import type {
	Command,
	ExtractInjectionAPI,
	FloatingToolbarItem,
	UiComponentFactoryParams,
} from '@atlaskit/editor-common/types';
import { calculateToolbarPositionAboveSelection } from '@atlaskit/editor-common/utils';
import type { Node as ProseMirrorNode } from '@atlaskit/editor-prosemirror/model';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import CommentIcon from '@atlaskit/icon/core/comment';

import type { DatePlugin } from './datePluginType';
import { dateNodeSpec } from './nodeviews/dateNodeSpec';
import { closeDatePicker, closeDatePickerWithAnalytics, createDate } from './pm-plugins/actions';
import { deleteDateCommand, insertDateCommand } from './pm-plugins/commands';
import keymap from './pm-plugins/keymap';
import createDatePlugin from './pm-plugins/main';
import { pluginKey as datePluginKey } from './pm-plugins/plugin-key';
import type { DateType } from './types';
import type { Props as DatePickerProps } from './ui/DatePicker';

const DatePicker = Loadable({
	loader: () =>
		import(/* webpackChunkName: "@atlaskit-internal_editor-datepicker" */ './ui/DatePicker').then(
			(mod) => mod.default,
		) as Promise<React.ComponentType<React.PropsWithChildren<DatePickerProps>>>,
	loading: () => null,
});

function ContentComponent({
	editorView,
	dispatchAnalyticsEvent,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	dependencyApi,
	weekStartDay,
}: Pick<
	UiComponentFactoryParams,
	| 'editorView'
	| 'dispatchAnalyticsEvent'
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'popupsScrollableElement'
> & {
	dependencyApi?: ExtractInjectionAPI<typeof datePlugin>;
} & {
	weekStartDay?: WeekDay;
}): JSX.Element | null {
	const { dispatch } = editorView;
	const domAtPos = editorView.domAtPos.bind(editorView);
	const { editorDisabledState, dateState } = useSharedPluginState(dependencyApi, [
		'date',
		'editorDisabled',
	]);

	if (!dateState?.showDatePickerAt || editorDisabledState?.editorDisabled) {
		return null;
	}

	const { showDatePickerAt, isNew, focusDateInput } = dateState;

	// Ignored via go/ees005
	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const element = findDomRefAtPos(showDatePickerAt, domAtPos) as HTMLElement;

	// Resolves ED-23702 for when the date is wrapped in an inline comment
	const dateNode = element?.classList.contains(DateSharedCssClassName.DATE_CONTAINER)
		? element
		: (element?.querySelector(`.${DateSharedCssClassName.DATE_CONTAINER}`) as HTMLElement | null);
	return (
		<DatePicker
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			key={showDatePickerAt}
			element={dateNode || element}
			isNew={isNew}
			autoFocus={focusDateInput}
			onDelete={() => {
				dependencyApi?.core?.actions.execute(deleteDateCommand(dependencyApi));
				editorView.focus();
			}}
			onSelect={(
				date: DateType | null,
				commitMethod?: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD,
			) => {
				// Undefined means couldn't parse date, null means invalid (out of bounds) date
				if (date === undefined || date === null) {
					return;
				}
				dependencyApi?.core?.actions.execute(
					insertDateCommand(dependencyApi)({
						date,
						commitMethod,
					}),
				);
				editorView.focus();
			}}
			onTextChanged={(date?: DateType) => {
				dependencyApi?.core?.actions.execute(
					insertDateCommand(dependencyApi)({
						date,
						enterPressed: false,
					}),
				);
			}}
			closeDatePicker={() => {
				closeDatePicker()(editorView.state, dispatch);
				editorView.focus();
			}}
			closeDatePickerWithAnalytics={({ date }: { date?: DateType }) => {
				closeDatePickerWithAnalytics({ date })(editorView.state, dispatch);
				editorView.focus();
			}}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			weekStartDay={weekStartDay}
		/>
	);
}

const datePlugin: DatePlugin = ({ config = {}, api }) => ({
	name: 'date',
	getSharedState(editorState) {
		if (!editorState) {
			return {
				showDatePickerAt: null,
				isNew: false,
				focusDateInput: false,
				isInitialised: true,
			};
		}
		const { showDatePickerAt, isNew, focusDateInput, isInitialised } =
			datePluginKey.getState(editorState) || {};
		return {
			showDatePickerAt,
			isNew: !!isNew,
			focusDateInput: !!focusDateInput,
			isInitialised: !!isInitialised,
		};
	},

	commands: {
		insertDate: insertDateCommand(api),
		deleteDate: deleteDateCommand(api),
	},

	nodes() {
		return [{ name: 'date', node: dateNodeSpec() }];
	},

	pmPlugins() {
		return [
			{
				name: 'date',
				plugin: (pmPluginFactoryParams) => {
					DatePicker.preload();
					return createDatePlugin(pmPluginFactoryParams);
				},
			},
			{
				name: 'dateKeymap',
				plugin: () => {
					DatePicker.preload();
					return keymap();
				},
			},
		];
	},

	contentComponent({
		editorView,
		dispatchAnalyticsEvent,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		return (
			<ContentComponent
				dependencyApi={api}
				editorView={editorView}
				dispatchAnalyticsEvent={dispatchAnalyticsEvent}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
				weekStartDay={config.weekStartDay}
			/>
		);
	},
	pluginsOptions: {
		quickInsert: ({ formatMessage }) => [
			{
				id: 'date',
				title: formatMessage(messages.date),
				description: formatMessage(messages.dateDescription),
				priority: 800,
				keywords: ['calendar', 'day', 'time', 'today', '/'],
				keyshortcut: '//',
				icon: () => <IconDate />,
				action(insert, state) {
					const tr = createDate(true)(state);

					api?.analytics?.actions?.attachAnalyticsEvent?.({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.DOCUMENT,
						actionSubjectId: ACTION_SUBJECT_ID.DATE,
						eventType: EVENT_TYPE.TRACK,
						attributes: { inputMethod: INPUT_METHOD.QUICK_INSERT },
					})(tr);

					return tr;
				},
			},
		],
		floatingToolbar: (state, intl) => {
			const isViewMode = () => api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

			if (!isViewMode()) {
				return undefined;
			}

			const onClick: Command = (stateFromClickEvent, dispatch) => {
				if (!api?.annotation) {
					return true;
				}
				if (api?.analytics?.actions) {
					api?.analytics?.actions?.fireAnalyticsEvent({
						action: ACTION.CLICKED,
						actionSubject: ACTION_SUBJECT.BUTTON,
						actionSubjectId: ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
						eventType: EVENT_TYPE.UI,
						attributes: {
							source: 'highlightActionsMenu',
							pageMode: 'edit',
							sourceNode: 'date',
						},
					});
				}
				const command = api.annotation?.actions?.setInlineCommentDraftState(
					true,
					INPUT_METHOD.TOOLBAR,
				);
				return command(stateFromClickEvent, dispatch);
			};

			return {
				title: 'Date floating toolbar',
				nodeType: [state.schema.nodes.date],
				getDomRef: (editorView) => {
					const dateState = datePluginKey.getState(state);
					const datePosition = dateState?.showDatePickerAt;

					if (!datePosition) {
						return undefined;
					}

					const domAtPos = editorView.domAtPos.bind(editorView);
					const domRef = findDomRefAtPos(datePosition, domAtPos);
					const isHTMLElement = (element: Node): element is HTMLElement => {
						return element instanceof HTMLElement;
					};

					if (isHTMLElement(domRef)) {
						return domRef;
					}
					return undefined;
				},
				onPositionCalculated: calculateToolbarPositionAboveSelection('Date floating toolbar'),
				items: (node: ProseMirrorNode): Array<FloatingToolbarItem<Command>> => {
					const annotationState = api?.annotation?.sharedState.currentState();
					const activeCommentMark = node.marks.find(
						(mark) =>
							mark.type.name === 'annotation' &&
							annotationState?.annotations[mark.attrs.id] === false,
					);
					const showAnnotation =
						annotationState &&
						annotationState.isVisible &&
						isViewMode() &&
						!annotationState.bookmark &&
						!annotationState.mouseData.isSelecting &&
						!activeCommentMark;

					if (showAnnotation) {
						return [
							{
								type: 'button',
								showTitle: true,
								testId: 'add-comment-date-button',
								icon: CommentIcon,
								title: intl.formatMessage(annotationMessages.createComment),
								onClick,
								tooltipContent: (
									<ToolTipContent
										description={intl.formatMessage(annotationMessages.createComment)}
									/>
								),
								supportsViewMode: true,
							},
						];
					}
					return [];
				},
			};
		},
	},
});

export default datePlugin;
