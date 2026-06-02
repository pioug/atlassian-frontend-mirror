import React, { useCallback, useState } from 'react';

import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { changeLanguage, detectLanguage } from '../editor-commands';
import type { CodeBlockPlugin } from '../index';

import {
	DETECT_LANGUAGE_VALUE,
	type LanguagePickerOption,
	type LanguagePickerSelectionSource,
} from './language-picker-options';
import type { LanguagePickerProps } from './LanguagePicker';
import { LanguagePicker } from './LanguagePicker';
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
}: CodeBlockLanguagePickerProps): React.JSX.Element => {
	const [recentLanguageValues, setRecentLanguageValues] = useState<string[]>(() =>
		getRecentLanguages(),
	);

	const refreshRecentLanguages = useCallback(() => {
		setRecentLanguageValues(getRecentLanguages());
	}, []);

	const handleSelection = useCallback(
		(option: LanguagePickerOption, selectionSource: LanguagePickerSelectionSource) => {
			const command: Command =
				option.value === DETECT_LANGUAGE_VALUE &&
				expValEquals('platform_editor_code_block_auto_detection', 'isEnabled', true)
					? detectLanguage()
					: changeLanguage(api?.analytics?.actions)(option.value, selectionSource);
			const commandSucceeded = command(editorView.state, editorView.dispatch);

			if (commandSucceeded && option.value !== DETECT_LANGUAGE_VALUE) {
				saveRecentLanguage(option.value);
				setRecentLanguageValues(getRecentLanguages());
			}
		},
		[api?.analytics?.actions, editorView],
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
		/>
	);
};
