import { fg } from '@atlaskit/platform-feature-flags';

type Messages = Record<string, string>;
type MessagesModule = { default: Messages | { default: Messages } };
type MessagesLoader = () => Promise<MessagesModule>;

type NestedMessagesModule = { default: Messages };

const isNestedMessagesModule = (
	value: Messages | NestedMessagesModule,
): value is NestedMessagesModule =>
	'default' in value && typeof value.default === 'object' && value.default !== null;

const unwrapMessages = (messages: MessagesModule): Messages => {
	const defaultExport = messages.default;

	return isNestedMessagesModule(defaultExport) ? defaultExport.default : defaultExport;
};

const messagesLoaders: Record<string, MessagesLoader> = {
	cs: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-cs" */ '../i18n/cs'
		),
	da: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-da" */ '../i18n/da'
		),
	de: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-de" */ '../i18n/de'
		),
	en: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-en" */ '../i18n/en'
		),
	en_GB: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-en_GB" */ '../i18n/en_GB'
		),
	en_ZZ: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-en_ZZ" */ '../i18n/en_ZZ'
		),
	es: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-es" */ '../i18n/es'
		),
	fi: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-fi" */ '../i18n/fi'
		),
	fr: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-fr" */ '../i18n/fr'
		),
	hr: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-hr" */ '../i18n/hr'
		),
	hu: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-hu" */ '../i18n/hu'
		),
	it: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-it" */ '../i18n/it'
		),
	ja: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-ja" */ '../i18n/ja'
		),
	ko: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-ko" */ '../i18n/ko'
		),
	nb: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-nb" */ '../i18n/nb'
		),
	nl: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-nl" */ '../i18n/nl'
		),
	pl: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-pl" */ '../i18n/pl'
		),
	pt_BR: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-pt_BR" */ '../i18n/pt_BR'
		),
	ru: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-ru" */ '../i18n/ru'
		),
	sl: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-sl" */ '../i18n/sl'
		),
	sr_RS: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-sr_RS" */ '../i18n/sr_RS'
		),
	sr_YR: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-sr_YR" */ '../i18n/sr_YR'
		),
	sv: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-sv" */ '../i18n/sv'
		),
	th: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-th" */ '../i18n/th'
		),
	tr: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-tr" */ '../i18n/tr'
		),
	uk: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-uk" */ '../i18n/uk'
		),
	vi: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-vi" */ '../i18n/vi'
		),
	zh: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-zh" */ '../i18n/zh'
		),
	zh_TW: () =>
		import(
			/* webpackChunkName: "@atlaskit-internal_@atlassian/feedback-collector-i18n-zh_TW" */ '../i18n/zh_TW'
		),
};

const getMessages = async (locale: string): Promise<Messages | undefined> => {
	const loadMessages = messagesLoaders[locale];

	if (!loadMessages) {
		return undefined;
	}

	try {
		const messages = await loadMessages();
		return unwrapMessages(messages);
	} catch {
		return undefined;
	}
};

/**
 * Legacy loader preserved for the `fun-2388_fix_feedback_collector_i18n` gate-off
 * path. It uses a free-form dynamic import which, in some builds (e.g. Jira),
 * generates non-existent async chunk URLs and silently fails to localize.
 */
const getMessagesForLocaleLegacy = async (locale: string): Promise<Messages | undefined> => {
	locale = locale.replace('-', '_');
	try {
		const messages = await import(
			/* webpackChunkName: "@atlaskit-internal_feedback-collector/i18n-tranlations" */ `../i18n/${locale}`
		);
		return messages.default;
	} catch (e) {
		// ignore
	}
	try {
		const parentLocale = locale.split(/[-_]/)[0];

		const messages = await import(
			/* webpackChunkName: "@atlaskit-internal_feedback-collector/i18n-tranlations" */ `../i18n/${parentLocale}`
		);
		return messages.default;
	} catch (e) {
		// ignore
	}
};

/**
 * Tries to get the most specific messages bundle for a given locale.
 *
 * Strategy:
 * 1. Try to find messages with the exact string (i.e. 'fr_FR')
 * 2. If that doesn't work, try to find messages for the language locale (i.e. 'fr')
 * 3. If that doesn't work, return undefined so react-intl uses english default messages.
 *
 * @param locale string specifying the locale like 'en_GB', or 'fr'.
 */
export const getMessagesForLocale = async (locale: string): Promise<Messages | undefined> => {
	if (!fg('fun-2388_fix_feedback_collector_i18n')) {
		return getMessagesForLocaleLegacy(locale);
	}

	const localeKey = locale.replace('-', '_');
	const messages = await getMessages(localeKey);

	return messages ?? getMessages(localeKey.split(/[-_]/)[0]);
};
