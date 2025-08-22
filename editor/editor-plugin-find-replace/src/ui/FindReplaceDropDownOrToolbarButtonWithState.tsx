import React, { useLayoutEffect, useState } from 'react';

import { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { blur, toggleMatchCase } from '../pm-plugins/commands';
import {
	activateWithAnalytics,
	cancelSearchWithAnalytics,
	findNextWithAnalytics,
	findPrevWithAnalytics,
	findWithAnalytics,
	replaceAllWithAnalytics,
	replaceWithAnalytics,
} from '../pm-plugins/commands-with-analytics';
import type { FindReplaceToolbarButtonWithStateProps } from '../types';

import FindReplaceDropdown from './FindReplaceDropdown';
import FindReplaceToolbarButton from './FindReplaceToolbarButton';

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
	isButtonHidden,
	doesNotHaveButton,
}: FindReplaceToolbarButtonWithStateProps) => {
	const editorAnalyticsAPI = api?.analytics?.actions;

	const { findReplaceState } = useSharedPluginStateNoDebounce(api);

	const shouldMatchCase = findReplaceState?.shouldMatchCase;
	const isActive = findReplaceState?.isActive;
	const findText = findReplaceState?.findText;
	const replaceText = findReplaceState?.replaceText;
	const index = findReplaceState?.index;
	const matches = findReplaceState?.matches;
	const shouldFocus = findReplaceState?.shouldFocus;

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
			dispatchCommand(findNextWithAnalytics(editorAnalyticsAPI, editorView)({ triggerMethod })),
		);
	};
	const handleFindPrev = ({
		triggerMethod,
	}: {
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
	}) => {
		runWithEditorFocused(() =>
			dispatchCommand(findPrevWithAnalytics(editorAnalyticsAPI, editorView)({ triggerMethod })),
		);
	};
	const handleReplace = ({
		triggerMethod,
		replaceText,
	}: {
		replaceText: string;
		triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
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

	if (
		shouldMatchCase === undefined ||
		isActive === undefined ||
		findText === undefined ||
		replaceText === undefined ||
		index === undefined ||
		matches === undefined ||
		shouldFocus === undefined
	) {
		return null;
	}

	const DropDownComponent = doesNotHaveButton ? FindReplaceDropdown : FindReplaceToolbarButton;
	return (
		<DropDownComponent
			shouldMatchCase={shouldMatchCase}
			onToggleMatchCase={handleToggleMatchCase}
			isActive={isActive}
			findText={findText}
			index={index}
			numMatches={matches.length}
			isReplaceable={
				expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? matches[index]?.canReplace
					: undefined
			}
			numReplaceable={
				expValEquals('platform_editor_find_and_replace_improvements', 'isEnabled', true)
					? matches.filter((match) => match.canReplace === true).length
					: undefined
			}
			replaceText={replaceText}
			shouldFocus={shouldFocus}
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
			isButtonHidden={isButtonHidden}
		/>
	);
};

export default React.memo(FindReplaceToolbarButtonWithState);
