import React, { useCallback, useState } from 'react';

import type { LanguagePickerProps } from './LanguagePicker';
import { LanguagePicker } from './LanguagePicker';
import { getRecentLanguages, saveRecentLanguage } from './recent-languages';

type CodeBlockLanguagePickerProps = Omit<
	LanguagePickerProps,
	'recentLanguageValues' | 'onLanguageSelect' | 'onMenuOpen'
>;

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

	const handleLanguageSelect = useCallback((language: string) => {
		saveRecentLanguage(language);
		setRecentLanguageValues(getRecentLanguages());
	}, []);

	return (
		<LanguagePicker
			api={api}
			defaultValue={defaultValue}
			editorView={editorView}
			filterOption={filterOption}
			formatMessage={formatMessage}
			languagePickerOptions={languagePickerOptions}
			recentLanguageValues={recentLanguageValues}
			onLanguageSelect={handleLanguageSelect}
			onMenuOpen={refreshRecentLanguages}
		/>
	);
};
