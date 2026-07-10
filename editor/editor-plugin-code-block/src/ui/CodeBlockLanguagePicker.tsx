import React, { useCallback, useState } from 'react';

import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

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
			const command: Command =
				isDetectLanguageSelected &&
				(fg('platform_editor_code_block_ga_patch_1') ||
					fg('platform_editor_code_block_language_detection_flow'))
					? detectLanguage()
					: changeLanguage(api?.analytics?.actions)(option.value, selectionSource);
			const commandSucceeded = command(editorView.state, editorView.dispatch);

			if (fg('platform_editor_code_block_dogfooding_patch')) {
				if (fg('platform_editor_code_block_ga_patch_1')) {
					if (interactionMethod === 'mouse') {
						requestAnimationFrame(() => {
							// Mouse-opened picker should return editing focus to the code block. Keyboard-opened
							// picker keeps focus on the trigger to avoid CodeMirror DOM focus without cm.hasFocus.
							api?.core.actions.focus({ scrollIntoView: false });
						});
					}
				} else {
					requestAnimationFrame(() => {
						// Let PopupSelect/FocusLock finish returning focus to the trigger, then restore the editor.
						api?.core.actions.focus({ scrollIntoView: false });
					});
				}
			}

			if (
				commandSucceeded &&
				(option.value !== DETECT_LANGUAGE_VALUE || fg('platform_editor_code_block_ga_patch_1'))
			) {
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
