import React, { useCallback, useState } from 'react';

import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { changeLanguage, detectLanguage } from '../editor-commands';
import type { CodeBlockPlugin } from '../index';

import {
	DETECT_LANGUAGE_VALUE,
	type LanguagePickerOption,
	type LanguagePickerSelectionSource,
} from './language-picker-options';
import {
	LanguagePicker,
	type LanguagePickerInteractionMethod,
	type LanguagePickerProps,
} from './LanguagePicker';
import { getRecentLanguages, saveRecentLanguage } from './recent-languages';

type CodeBlockLanguagePickerProps = Omit<
	LanguagePickerProps,
	'recentLanguageValues' | 'onMenuOpen' | 'onSelection'
> & {
	api: ExtractInjectionAPI<CodeBlockPlugin> | undefined;
	editorView: EditorView;
};

export const CodeBlockLanguagePicker = ({
	api,
	defaultValue,
	editorView,
	filterOption,
	formatMessage,
	languagePickerOptions,
	triggerSpacing,
}: CodeBlockLanguagePickerProps): React.JSX.Element => {
	const [recentLanguageValues, setRecentLanguageValues] = useState<string[]>(() =>
		getRecentLanguages(),
	);

	const refreshRecentLanguages = useCallback(() => {
		setRecentLanguageValues(getRecentLanguages());
	}, []);

	const handleSelection = useCallback(
		(
			option: LanguagePickerOption,
			selectionSource: LanguagePickerSelectionSource,
			interactionMethod?: LanguagePickerInteractionMethod,
		) => {
			const isDetectLanguageSelected = option.value === DETECT_LANGUAGE_VALUE;
			const command: Command = isDetectLanguageSelected
				? detectLanguage()
				: changeLanguage(api?.analytics?.actions)(option.value, selectionSource);
			const commandSucceeded = command(editorView.state, editorView.dispatch);

			if (interactionMethod === 'mouse') {
				requestAnimationFrame(() => {
					// Mouse-opened picker should return editing focus to the code block. Keyboard-opened
					// picker keeps focus on the trigger to avoid CodeMirror DOM focus without cm.hasFocus.
					api?.core.actions.focus({ scrollIntoView: false });
				});
			}

			if (commandSucceeded) {
				saveRecentLanguage(option.value);
				setRecentLanguageValues(getRecentLanguages());
			}
		},
		[api?.analytics?.actions, api?.core.actions, editorView],
	);

	return (
		<LanguagePicker
			defaultValue={defaultValue}
			filterOption={filterOption}
			formatMessage={formatMessage}
			languagePickerOptions={languagePickerOptions}
			recentLanguageValues={recentLanguageValues}
			onMenuOpen={refreshRecentLanguages}
			onSelection={handleSelection}
			triggerSpacing={triggerSpacing}
		/>
	);
};
