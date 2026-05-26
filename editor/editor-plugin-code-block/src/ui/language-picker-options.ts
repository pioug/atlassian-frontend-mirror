import type { IntlShape } from 'react-intl';

import { codeBlockButtonMessages } from '@atlaskit/editor-common/messages';
import type { GroupType } from '@atlaskit/select';

export const NONE_LANGUAGE_VALUE = 'none';
export const DETECT_LANGUAGE_VALUE = 'autodetect';
export const PLAIN_TEXT_LANGUAGE_VALUE = 'text';

export type LanguagePickerSelectionSource = 'all' | 'pinned' | 'recentlyUsed' | 'search';

export type LanguagePickerOption = {
	alias: readonly string[];
	label: string;
	selectionSource?: LanguagePickerSelectionSource;
	value: string;
};

export type LanguagePickerOptionGroup = GroupType<LanguagePickerOption>;

type CreateGroupedLanguageOptionsProps = {
	formatMessage: IntlShape['formatMessage'];
	languages: LanguagePickerOption[];
	recentlyUsedLanguages?: LanguagePickerOption[];
};

export const getDetectLanguageOption = (
	formatMessage: IntlShape['formatMessage'],
): LanguagePickerOption => ({
	alias: [DETECT_LANGUAGE_VALUE],
	label: formatMessage(codeBlockButtonMessages.detectLanguage),
	selectionSource: 'pinned',
	value: DETECT_LANGUAGE_VALUE,
});

export const createGroupedLanguageOptions = ({
	formatMessage,
	languages,
	recentlyUsedLanguages = [],
}: CreateGroupedLanguageOptionsProps): LanguagePickerOptionGroup[] => {
	const recentlyUsedLanguageValues = new Set(
		recentlyUsedLanguages.map((language) => language.value),
	);
	const allLanguages = languages.filter(
		(language) =>
			language.value !== NONE_LANGUAGE_VALUE &&
			language.value !== PLAIN_TEXT_LANGUAGE_VALUE &&
			!recentlyUsedLanguageValues.has(language.value),
	);

	const plainTextOption = languages.find(
		(language) => language.value === PLAIN_TEXT_LANGUAGE_VALUE,
	);
	const pinnedOptions = [getDetectLanguageOption(formatMessage)];
	if (plainTextOption) {
		pinnedOptions.push({ ...plainTextOption, selectionSource: 'pinned' });
	}

	return [
		{
			label: '',
			options: pinnedOptions,
		},
		...(recentlyUsedLanguages.length > 0
			? [
					{
						label: formatMessage(codeBlockButtonMessages.recentlyUsed),
						options: recentlyUsedLanguages.map(
							(language): LanguagePickerOption => ({
								...language,
								selectionSource: 'recentlyUsed',
							}),
						),
					},
				]
			: []),
		{
			label: formatMessage(codeBlockButtonMessages.all),
			options: allLanguages.map(
				(language): LanguagePickerOption => ({ ...language, selectionSource: 'all' }),
			),
		},
	];
};
