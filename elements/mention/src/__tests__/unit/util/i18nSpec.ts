import languages from '../../../i18n/languages';
import englishMessages from '../../../i18n/en';
import { getMessagesForLocale } from '../../../util/i18n';

describe('Mentions i18n', () => {
	Object.keys(languages).forEach((locale) => {
		it(`should resolve to a language pack for locale ${locale}`, async () => {
			var message = await getMessagesForLocale(locale);
			if (locale === 'en_GB' || locale === 'en') {
				expect(message).toEqual(englishMessages);
			} else {
				// if locale is not 'en' and is not found by getMessagesForLocale
				// it will default to 'en'. To make sure the default case is not reached,
				// test that it does not equal the 'en' messages.
				expect(message).not.toEqual(englishMessages);
			}
		});
	});
});
