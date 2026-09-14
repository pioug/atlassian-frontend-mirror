import React, { useCallback } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { isOfflineMode } from '@atlaskit/editor-common/connectivity/isOfflineMode';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type {
	Command,
	ExtractInjectionAPI,
	QuickInsertSearchOptions,
	QuickInsertSharedState,
} from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { closeElementBrowser, closeElementBrowserModal } from '../../pm-plugins/commands';
import { pluginKey } from '../../pm-plugins/plugin-key';
import type { QuickInsertPlugin } from '../../quickInsertPluginType';

import ModalElementBrowser from './ModalElementBrowser';

type Props = {
	editorView: EditorView;
	helpUrl: string | undefined;
	pluginInjectionAPI: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
};

const Modal = ({
	quickInsertState,
	isOffline,
	editorView,
	helpUrl,
	insertItem,
	getSuggestions,
	api,
	defaultCategory,
}: {
	api: ExtractInjectionAPI<QuickInsertPlugin> | undefined;
	defaultCategory?: string;
	editorView: EditorView;
	getSuggestions?: (searchOptions: QuickInsertSearchOptions) => QuickInsertItem[];
	helpUrl?: string;
	insertItem?: (
		item: QuickInsertItem,
		source?: INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR | INPUT_METHOD.ELEMENT_BROWSER,
	) => Command;
	isOffline: boolean;
	quickInsertState: {
		emptyStateHandler?: QuickInsertSharedState['emptyStateHandler'];
		isElementBrowserOpen?: QuickInsertSharedState['isElementBrowserOpen'];
		lazyDefaultItems?: QuickInsertSharedState['lazyDefaultItems'];
		providedItems?: QuickInsertSharedState['providedItems'];
	};
}) => {
	const getItems = useCallback(
		(query?: string, category?: string) =>
			getSuggestions?.({
				query,
				category,
			})?.map((item) => {
				return isOffline && item.isDisabledOffline ? { ...item, isDisabled: true } : item;
			}) ?? [],
		// See: https://stash.atlassian.com/projects/ATLASSIAN/repos/atlassian-frontend-monorepo/pull-requests/157796/overview?commentId=8559952
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[getSuggestions, quickInsertState.lazyDefaultItems, quickInsertState.providedItems, isOffline],
	);

	const focusInEditor = useCallback(() => {
		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	}, [editorView]);

	// ED-19408 We not store the item ref in the state
	// Instead of adding the item immediately on insert item
	// We wait until modal close is complete, refocus the editor and then add the item
	const insertableItem = React.useRef<QuickInsertItem | null>(null);
	const closeBrowser = useCallback(() => {
		const closeCommand = isExperimentEnabled('platform_editor_slash_command')
			? closeElementBrowser
			: closeElementBrowserModal;
		closeCommand()(editorView.state, editorView.dispatch);
	}, [editorView]);
	const onInsertItem = useCallback(
		(item: QuickInsertItem) => {
			closeBrowser();
			if (fg('platform_editor_ease_of_use_metrics')) {
				api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
			}
			insertableItem.current = item;
		},
		[closeBrowser, api],
	);

	const onClose = useCallback(() => {
		closeBrowser();
		if (fg('platform_editor_ease_of_use_metrics')) {
			api?.core.actions.execute(api?.metrics?.commands.startActiveSessionTimer());
		}
		focusInEditor();
	}, [closeBrowser, focusInEditor, api]);

	const onCloseComplete = useCallback(() => {
		if (!insertableItem.current) {
			focusInEditor();
			return;
		}

		const item = insertableItem.current;
		insertableItem.current = null;

		focusInEditor();

		insertItem?.(item, INPUT_METHOD.ELEMENT_BROWSER)(editorView.state, editorView.dispatch);
	}, [editorView, focusInEditor, insertItem]);

	return (
		<ModalElementBrowser
			defaultCategory={defaultCategory}
			getItems={getItems}
			onInsertItem={onInsertItem}
			helpUrl={helpUrl}
			isOpen={quickInsertState.isElementBrowserOpen || false}
			emptyStateHandler={quickInsertState.emptyStateHandler}
			onClose={onClose}
			onCloseComplete={onCloseComplete}
			shouldReturnFocus={false}
		/>
	);
};

export default ({ editorView, helpUrl, pluginInjectionAPI }: Props): React.JSX.Element => {
	const { lazyDefaultItems, providedItems, isElementBrowserOpen, emptyStateHandler, mode } =
		useSharedPluginStateWithSelector(
			pluginInjectionAPI,
			['quickInsert', 'connectivity'],
			(state) => ({
				lazyDefaultItems: state.quickInsertState?.lazyDefaultItems,
				providedItems: state.quickInsertState?.providedItems,
				isElementBrowserOpen: isExperimentEnabled('platform_editor_slash_command')
					? state.quickInsertState?.isElementBrowserOpen
					: state.quickInsertState?.isElementBrowserModalOpen,
				emptyStateHandler: state.quickInsertState?.emptyStateHandler,
				mode: state.connectivityState?.mode,
			}),
		);

	return (
		<Modal
			defaultCategory={pluginKey.getState(editorView.state)?.elementBrowserInitialCategory}
			// eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed)
			quickInsertState={{
				lazyDefaultItems,
				providedItems,
				isElementBrowserOpen,
				emptyStateHandler,
			}}
			editorView={editorView}
			helpUrl={helpUrl}
			isOffline={isOfflineMode(mode)}
			insertItem={pluginInjectionAPI?.quickInsert?.actions?.insertItem}
			getSuggestions={pluginInjectionAPI?.quickInsert?.actions?.getSuggestions}
			api={pluginInjectionAPI}
		/>
	);
};
