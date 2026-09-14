import { fuzzyCharacter } from '../../jira-search-container/buildJQL';

export const removeFuzzyCharacter = (value?: string): string | undefined => {
	if (value?.endsWith(fuzzyCharacter)) {
		return value.slice(0, -1);
	}

	return value;
};
