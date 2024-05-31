import React, { useLayoutEffect, useState } from 'react';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';

import { blur, toggleMatchCase } from './commands';
import {
	activateWithAnalytics,
	cancelSearchWithAnalytics,
	findNextWithAnalytics,
	findPrevWithAnalytics,
	findWithAnalytics,
	replaceAllWithAnalytics,
	replaceWithAnalytics,
} from './commands-with-analytics';
import type { FindReplaceToolbarButtonWithStateProps } from './types';
import FindReplaceToolbarButton from './ui/FindReplaceToolbarButton';

// light implementation of useSharedPluginState(). This is due to findreplace
// being the only plugin that previously used WithPluginState with
// debounce=false. That was implemented because of text sync issues
// between editor & findreplace dialog.
// To address under ENGHEALTH-5853
const useSharedPluginStateNoDebounce = (api: FindReplaceToolbarButtonWithStateProps['api']) => {
	const [state, setState] = useState(api?.findReplace?.sharedState.currentState());
	useLayoutEffect(() => {
		const unsub = api?.findReplace?.sharedState.onChange(({ nextSharedState }) => {
			setState(nextSharedState);
		});

		return () => {
			unsub?.();
		};
	}, [api]);

	return { findReplaceState: state };
};

const FindReplaceToolbarButtonWithState = ({
	popupsBoundariesElement,
	popupsMountPoint,
	popupsScrollableElement,
	isToolbarReducedSpacing,
	editorView,
	containerElement,
	dispatchAnalyticsEvent,
	takeFullWidth,
	api,
}: FindReplaceToolbarButtonWithStateProps) => {
	const editorAnalyticsAPI = api?.analytics?.actions;
	const { findReplaceState } = useSharedPluginStateNoDebounce(api);

	if (!editorView) {
		return null;
	}

	// we need the editor to be in focus for scrollIntoView() to work
	// so we focus it while we run the command, then put focus back into
	// whatever element was previously focused in find replace component
	const runWithEditorFocused = (fn: Function) => {
		const activeElement = document.activeElement as HTMLElement | null;
		editorView.focus();
		fn();
		activeElement?.focus();
	};

	const dispatchCommand = (cmd: Command) => {
		const { state, dispatch } = editorView;
		cmd(state, dispatch);
	};

	const handleActivate = () => {
		runWithEditorFocused(() =>
			dispatchCommand(
				activateWithAnalytics(editorAnalyticsAPI)({
					triggerMethod: TRIGGER_METHOD.TOOLBAR,
				}),
			),
		);
	};
	const handleFind = (keyword?: string) => {
		runWithEditorFocused(() =>
			dispatchCommand(
				findWithAnalytics(editorAnalyticsAPI)({
					editorView,
					containerElement,
					keyword,
				}),
			),
		);
	};
	const handleFindNext = ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => {
		runWithEditorFocused(() =>
			dispatchCommand(findNextWithAnalytics(editorAnalyticsAPI)({ triggerMethod })),
		);
	};
	const handleFindPrev = ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => {
		runWithEditorFocused(() =>
			dispatchCommand(findPrevWithAnalytics(editorAnalyticsAPI)({ triggerMethod })),
		);
	};
	const handleReplace = ({
		triggerMethod,
		replaceText,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
		replaceText: string;
	}) => {
		runWithEditorFocused(() =>
			dispatchCommand(
				replaceWithAnalytics(editorAnalyticsAPI)({
					triggerMethod,
					replaceText,
				}),
			),
		);
	};
	const handleReplaceAll = ({ replaceText }: { replaceText: string }) => {
		runWithEditorFocused(() =>
			dispatchCommand(replaceAllWithAnalytics(editorAnalyticsAPI)({ replaceText })),
		);
	};
	const handleFindBlur = () => {
		dispatchCommand(blur());
	};
	const handleCancel = ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
	}) => {
		dispatchCommand(cancelSearchWithAnalytics(editorAnalyticsAPI)({ triggerMethod }));
		editorView.focus();
	};
	const handleToggleMatchCase = () => {
		dispatchCommand(toggleMatchCase());
	};

	if (!findReplaceState) {
		return null;
	}
	return (
		<FindReplaceToolbarButton
			shouldMatchCase={findReplaceState.shouldMatchCase}
			onToggleMatchCase={handleToggleMatchCase}
			isActive={findReplaceState.isActive}
			findText={findReplaceState.findText}
			index={findReplaceState.index}
			numMatches={findReplaceState.matches.length}
			replaceText={findReplaceState.replaceText}
			shouldFocus={findReplaceState.shouldFocus}
			popupsBoundariesElement={popupsBoundariesElement}
			popupsMountPoint={popupsMountPoint}
			popupsScrollableElement={popupsScrollableElement}
			isReducedSpacing={!!isToolbarReducedSpacing}
			dispatchAnalyticsEvent={dispatchAnalyticsEvent}
			onFindBlur={handleFindBlur}
			onCancel={handleCancel}
			onActivate={handleActivate}
			onFind={handleFind}
			onFindNext={handleFindNext}
			onFindPrev={handleFindPrev}
			onReplace={handleReplace}
			onReplaceAll={handleReplaceAll}
			takeFullWidth={!!takeFullWidth}
		/>
	);
};

export default React.memo(FindReplaceToolbarButtonWithState);
