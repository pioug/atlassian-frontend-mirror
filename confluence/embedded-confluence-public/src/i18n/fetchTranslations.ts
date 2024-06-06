import en_GB from './en_GB';
import en from './en';

const fetchTranslations = async (locale: string): Promise<Record<string, string>> => {
	switch (locale) {
		case 'en-GB':
			return en_GB;
		case 'en-US':
		default:
			return en;
	}
};

export default fetchTranslations;
