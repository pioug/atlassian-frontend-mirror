// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import React, { useEffect } from 'react';

import { useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { toolbarInsertBlockMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { MenuItem } from '@atlaskit/editor-common/ui-menu';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import { Box, xcss } from '@atlaskit/primitives';

import { type InsertBlockOptions, type InsertBlockPlugin } from '../../plugin';
import { toggleInsertMenuRightRail } from '../../pm-plugins/commands';
import InsertMenu from '../ElementBrowser/InsertMenu';
import type { OnInsert } from '../ElementBrowser/types';

import { useInsertMenuRailItems } from './useInsertMenuRailItems';

const panelWrapper = xcss({
	height: '100%',
});

const panelContentHeader = xcss({
	height: '32px',
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

/**
 * For insert menu in right rail experiment
 * - Clean up ticket ED-24801
 */
export const InsertMenuRail = ({
	editorView,
	options,
	api,
}: {
	editorView: EditorView;
	options: InsertBlockOptions;
	api?: ExtractInjectionAPI<InsertBlockPlugin>;
}) => {
	const dropdownItems = useInsertMenuRailItems(editorView, options, api);
	const { formatMessage } = useIntl();

	const onInsert = ({ item }: { item: MenuItem }) => {
		const { state, dispatch } = editorView;

		let inputMethod = INPUT_METHOD.INSERT_MENU_RIGHT_RAIL;

		if (!api) {
			return;
		}

		if (!editorView.hasFocus()) {
			editorView.focus();
		}

		// Below is duplicated from ToolbarInsertBlock/index.tsx - this function is only called
		// for BlockMenuItem items, which are rendered in the insert menu when no search has been performed.
		// When a search is performed, the list will be filled by QuickInsertItems, which handle their own insertion.
		switch (item.value.name) {
			case 'link':
				// @ts-expect-error
				api.core?.actions.execute(api?.hyperlink?.commands.showLinkToolbar(inputMethod));
				break;
			case 'table':
				// workaround to solve race condition where cursor is not placed correctly inside table
				queueMicrotask(() => {
					// @ts-expect-error
					api.table?.actions.insertTable?.({
						action: ACTION.INSERTED,
						actionSubject: ACTION_SUBJECT.DOCUMENT,
						actionSubjectId: ACTION_SUBJECT_ID.TABLE,
						attributes: { inputMethod },
						eventType: EVENT_TYPE.TRACK,
					})(state, dispatch);
				});
				break;
			case 'image upload':
				api.imageUpload?.actions.startUpload()(state, dispatch);
				break;
			case 'media':
				const mediaState = api.media?.sharedState.currentState();
				if (mediaState) {
					mediaState.showMediaPicker();
					// @ts-expect-error
					api.analytics?.actions.attachAnalyticsEvent({
						action: ACTION.OPENED,
						actionSubject: ACTION_SUBJECT.PICKER,
						actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
						attributes: { inputMethod },
						eventType: EVENT_TYPE.UI,
					});
				}
				break;
			case 'mention':
				const pluginState = api.mention?.sharedState.currentState();
				if (pluginState && pluginState.canInsertMention) {
					// @ts-expect-error
					api.mention?.actions?.openTypeAhead(inputMethod);
				}
				break;
			case 'emoji':
				// @ts-expect-error
				api.emoji?.actions.openTypeAhead(inputMethod);
				break;
			case 'codeblock':
				api.codeBlock?.actions.insertCodeBlock(inputMethod)(state, dispatch);
				break;
			case 'blockquote':
				// @ts-expect-error
				api.blockType?.actions.insertBlockQuote(inputMethod)(state, dispatch);
				break;
			case 'panel':
				api.panel?.actions.insertPanel(inputMethod)(state, dispatch);
				break;
			case 'action':
				// @ts-expect-error
				api.taskDecision?.actions.insertTaskDecision('taskList', inputMethod)(state, dispatch);
				break;
			case 'decision':
				// @ts-expect-error
				api.taskDecision?.actions.insertTaskDecision('decisionList', inputMethod)(state, dispatch);
				break;
			case 'horizontalrule':
				// @ts-expect-error
				api.rule?.actions.insertHorizontalRule(inputMethod)(state, dispatch);
				break;
			case 'macro':
				api.core?.actions.execute(api.quickInsert?.commands.openElementBrowserModal);
				break;
			case 'date':
				api.core?.actions.execute(
					api.date?.commands?.insertDate({
						// @ts-expect-error
						inputMethod,
					}),
				);
				break;
			case 'placeholder text':
				api.placeholderText?.actions.showPlaceholderFloatingToolbar(
					editorView.state,
					editorView.dispatch,
				);
				break;
			case 'layout':
				// @ts-expect-error
				api.layout?.actions.insertLayoutColumns(inputMethod)(editorView.state, editorView.dispatch);
				break;
			case 'status':
				// @ts-expect-error
				api.core?.actions.execute(api.status?.commands?.insertStatus(inputMethod));
				break;

			// https://product-fabric.atlassian.net/browse/ED-8053
			// @ts-ignore: OK to fallthrough to default
			case 'expand':
				if (options.allowExpand) {
					api.expand?.actions.insertExpand(state, dispatch);
					break;
				}

			// eslint-disable-next-line no-fallthrough
			default:
			// leaving this blank for now
		}
	};

	useEffect(() => {
		if (!api) {
			return;
		}
		api.core.actions.execute(({ tr }) => {
			api.analytics?.actions.attachAnalyticsEvent({
				action: ACTION.OPENED,
				// @ts-expect-error
				actionSubject: INPUT_METHOD.INSERT_MENU_RIGHT_RAIL,
				eventType: EVENT_TYPE.UI,
			})(tr);
			return tr;
		});

		return () => {
			if (!api) {
				return;
			}
			api.core.actions.execute(({ tr }) => {
				api.analytics?.actions.attachAnalyticsEvent({
					action: ACTION.CLOSED,
					// @ts-expect-error
					actionSubject: INPUT_METHOD.INSERT_MENU_RIGHT_RAIL,
					eventType: EVENT_TYPE.UI,
				})(tr);
				return tr;
			});
		};
	}, [api]);

	return (
		<Box xcss={panelWrapper}>
			<Box xcss={panelContentHeader}>
				<Heading size="small" as="h2">
					{formatMessage(toolbarInsertBlockMessages.insertRightRailTitle)}
				</Heading>
				<IconButton
					appearance="subtle"
					testId="right-rail-insert-menu-close-button"
					label={formatMessage(toolbarInsertBlockMessages.closeInsertRightRail)}
					icon={CrossIcon}
					onClick={() => {
						if (!api) {
							return;
						}
						api.core.actions.execute(({ tr }) => {
							toggleInsertMenuRightRail(tr);
							api.contextPanel?.actions.applyChange(tr);
							return tr;
						});
					}}
				/>
			</Box>
			<InsertMenu
				editorView={editorView}
				dropdownItems={dropdownItems}
				onInsert={onInsert as OnInsert}
				toggleVisiblity={() => {}}
				showElementBrowserLink={true}
				pluginInjectionApi={api}
				isFullPageAppearance
			/>
		</Box>
	);
};
