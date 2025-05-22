import { defaultLocales } from '@atlaskit/locale/LocaleSelect';

const normalize = (locale: string) => {
	return locale.toLowerCase();
};

const normalizeNoRegion = (locale: string) => {
	return normalize(locale).split('-')[0];
};

const detectVtt = (file: File, _content: string) => {
	// TODO: detect language from content

	const name = file.name;
	const sections = name.split('.');

	// Section match with a default locale language and region
	for (const section of sections) {
		const detected = defaultLocales.find(
			(locale) => normalize(section) === normalize(locale.value),
		);
		if (detected) {
			return section;
		}
	}
	// Section match with a default locale language
	for (const section of sections) {
		const detected = defaultLocales.find(
			(locale) => normalizeNoRegion(section) === normalizeNoRegion(locale.value),
		);
		if (detected) {
			return section;
		}
	}

	// Section results in a valid Intl.Locale
	/* 
		new Intl.Locale is quite permisive with its input.
		It allows several text that do not really represent a locale. This is why we prioritize the previous checks 
	*/
	for (const section of sections) {
		try {
			return new Intl.Locale(section).baseName;
		} catch (error) {
			// silence is golden
		}
	}

	return null;
};

export const detectLanguage = async (file: File): Promise<string | null> => {
	const reader = new FileReader();
	const result = new Promise<string | null>((resolve, reject) => {
		reader.onload = (event) => {
			const text = event.target?.result as string;

			if (file.type === 'text/vtt') {
				const language = detectVtt(file, text);
				resolve(language);
			}
			resolve(null);
		};

		reader.onerror = (event) => {
			reject(event.target?.error);
		};
	});

	reader.readAsText(file);
	return result;
};
