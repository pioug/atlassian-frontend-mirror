import { tr, zh_TW } from '../i18n';
import { getMessagesForLocale } from './i18n-util';

describe('getMessagesForLocale', () => {
	it('returns the Turkish locale bundle', () => {
		expect(getMessagesForLocale('tr-TR')).toBe(tr);
	});

	it('returns the Traditional Chinese locale bundle', () => {
		expect(getMessagesForLocale('zh-TW')).toBe(zh_TW);
	});
});
