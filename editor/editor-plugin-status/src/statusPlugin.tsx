import React from 'react';

import {
	ACTION_SUBJECT_ID,
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { addInlineComment, ToolTipContent } from '@atlaskit/editor-common/keymaps';
import {
	annotationMessages,
	toolbarInsertBlockMessages as messages,
} from '@atlaskit/editor-common/messages';
import { IconStatus } from '@atlaskit/editor-common/quick-insert';
import type { FloatingToolbarItem, Command } from '@atlaskit/editor-common/types';
import { calculateToolbarPositionAboveSelection } from '@atlaskit/editor-common/utils';
import CommentIcon from '@atlaskit/icon/core/comment';
import { fg } from '@atlaskit/platform-feature-flags';

import { statusNodeSpec } from './nodeviews/statusNodeSpec';
import {
	commitStatusPicker,
	insertStatus,
	removeStatus,
	updateStatusWithAnalytics,
} from './pm-plugins/actions';
import { keymapPlugin } from './pm-plugins/keymap';
import createStatusPlugin from './pm-plugins/plugin';
import { pluginKey } from './pm-plugins/plugin-key';
import type { StatusPlugin } from './statusPluginType';
import { ContentComponent } from './ui/ContentComponent';

export const statusPlugin: StatusPlugin = ({ config: options, api }) => ({
	name: 'status',

	nodes() {
		return [{ name: 'status', node: statusNodeSpec() }];
	},

	pmPlugins() {
		return [
			{
				name: 'status',
				plugin: (pmPluginFactoryParams) => createStatusPlugin(pmPluginFactoryParams, options),
			},
			{ name: 'statusKeymap', plugin: keymapPlugin },
		];
	},

	actions: {
		commitStatusPicker,
		updateStatus: updateStatusWithAnalytics(api?.analytics?.actions),
	},

	commands: {
		removeStatus,
		insertStatus: insertStatus(api?.analytics?.actions),
	},

	getSharedState(state) {
		if (!state) {
			return undefined;
		}
		const pluginState = pluginKey.getState(state);

		return pluginState
			? {
					isNew: pluginState.isNew,
					showStatusPickerAt: pluginState.showStatusPickerAt,
					focusStatusInput: pluginState.focusStatusInput,
				}
			: undefined;
	},

	pluginsOptions: {
		quickInsert: ({ formatMessage }) => {
			if (options?.menuDisabled === true) {
				return [];
			}

			return [
				{
					id: 'status',
					title: formatMessage(messages.status),
					description: formatMessage(messages.statusDescription),
					priority: 700,
					keywords: ['lozenge'],
					icon: () => <IconStatus />,
					action(_insert, state) {
						return (
							insertStatus(api?.analytics?.actions)(INPUT_METHOD.QUICK_INSERT)({ tr: state.tr }) ??
							state.tr
						);
					},
				},
			];
		},
		floatingToolbar(state, intl) {
			const isViewMode = () => api?.editorViewMode?.sharedState.currentState()?.mode === 'view';

			if (!fg('platform_inline_node_as_valid_annotation_selection') || !isViewMode()) {
				return undefined;
			}

			return {
				title: 'Status floating toolbar',
				nodeType: state.schema.nodes.status,
				onPositionCalculated: calculateToolbarPositionAboveSelection('Status floating toolbar'),
				items: (node) => {
					const annotationState = api?.annotation?.sharedState.currentState();
					const hasActiveMark = node.marks.some(
						(mark) =>
							mark.type.name === 'annotation' &&
							annotationState?.annotations[mark.attrs.id] === false,
					);
					const showAnnotation =
						annotationState &&
						isViewMode() &&
						annotationState.isVisible &&
						!annotationState.bookmark &&
						!annotationState.mouseData.isSelecting &&
						!hasActiveMark;

					const onCommentClick: Command = (stateFromClickEvent, dispatch) => {
						if (!api?.annotation) {
							return true;
						}

						const command = api.annotation.actions.setInlineCommentDraftState(
							true,
							INPUT_METHOD.TOOLBAR,
						);
						api?.analytics?.actions?.fireAnalyticsEvent({
							action: ACTION.CLICKED,
							actionSubject: ACTION_SUBJECT.BUTTON,
							actionSubjectId: ACTION_SUBJECT_ID.CREATE_INLINE_COMMENT_FROM_HIGHLIGHT_ACTIONS_MENU,
							eventType: EVENT_TYPE.UI,
							attributes: {
								source: 'highlightActionsMenu',
								pageMode: 'edit',
								sourceNode: 'status',
							},
						});

						return command(stateFromClickEvent, dispatch);
					};

					const createCommentMessage = intl.formatMessage(annotationMessages.createComment);

					const commentItems: FloatingToolbarItem<Command>[] = showAnnotation
						? [
								{
									type: 'button',
									title: createCommentMessage,
									onClick: onCommentClick,
									showTitle: true,
									tooltipContent: (
										<ToolTipContent description={createCommentMessage} keymap={addInlineComment} />
									),
									icon: CommentIcon,
									supportsViewMode: true,
								},
							]
						: [];

					return [...commentItems];
				},
			};
		},
	},

	contentComponent({
		editorView,
		popupsMountPoint,
		popupsBoundariesElement,
		popupsScrollableElement,
	}) {
		const domAtPos = editorView.domAtPos.bind(editorView);

		return (
			<ContentComponent
				domAtPos={domAtPos}
				api={api}
				editorView={editorView}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				popupsScrollableElement={popupsScrollableElement}
			/>
		);
	},
});
