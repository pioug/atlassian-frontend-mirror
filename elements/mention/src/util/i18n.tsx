import React from 'react';
import { FormattedMessage, type MessageDescriptor, useIntl } from 'react-intl-next';
import { messages } from '../components/i18n';

export type Formatter = (props: {
	values?: { [k: string]: string };
	children?(props: string): React.ReactElement;
}) => React.ReactElement | null;

type FormatterFactory = (messageDescriptor: MessageDescriptor) => Formatter;

export const propFormatter: FormatterFactory =
	(messageDescriptor: MessageDescriptor) =>
	({
		values,
		children,
	}: {
		values?: { [k: string]: string };
		children?(props: string): React.ReactElement;
	}) => {
		const { formatMessage } = useIntl();
		const message = formatMessage(messageDescriptor, values);
		if (typeof children === 'function') {
			return children(message);
		}
		return <FormattedMessage values={values} {...messageDescriptor} />;
	};

export const UnknownUserError = propFormatter(messages.unknownUserError);
export const NoAccessWarning = propFormatter(messages.noAccessWarning);
export const NoAccessLabel = propFormatter(messages.noAccessLabel);
export const DefaultHeadline = propFormatter(messages.defaultHeadline);
export const DefaultAdvisedAction = propFormatter(messages.defaultAdvisedAction);
export const LoginAgain = propFormatter(messages.loginAgain);
export const DifferentText = propFormatter(messages.differentText);

/**
 * Tries to get the most specific messages bundle for a given locale.
 *
 * Strategy:
 * 1. Try to find messages with the exact string (i.e. 'fr_FR')
 * 2. If that doesn't work, try to find messages for the country locale (i.e. 'fr')
 * 3. If that doesn't work, return english messages as a fallback.
 *
 * @param locale string specifying the locale like 'en_GB', or 'fr'.
 */
export const getMessagesForLocale = async (locale: string): Promise<Record<string, string>> => {
	switch (locale) {
		case 'cs': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-cs" */ '../i18n/cs').then(
				(mod) => mod.default,
			);
		}
		case 'da': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-da" */ '../i18n/da').then(
				(mod) => mod.default,
			);
		}
		case 'de': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-de" */ '../i18n/de').then(
				(mod) => mod.default,
			);
		}
		case 'en': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-en" */ '../i18n/en').then(
				(mod) => mod.default,
			);
		}
		case 'en_GB': {
			return import(
				/* webpackChunkName: "@atlaskit-internal_mention-i18n-en_GB" */ '../i18n/en_GB'
			).then((mod) => mod.default);
		}
		case 'en_ZZ': {
			return import(
				/* webpackChunkName: "@atlaskit-internal_mention-i18n-en_ZZ" */ '../i18n/en_ZZ'
			).then((mod) => mod.default);
		}
		case 'es': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-es" */ '../i18n/es').then(
				(mod) => mod.default,
			);
		}
		case 'et': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-et" */ '../i18n/et').then(
				(mod) => mod.default,
			);
		}
		case 'fi': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-fi" */ '../i18n/fi').then(
				(mod) => mod.default,
			);
		}
		case 'fr': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-fr" */ '../i18n/fr').then(
				(mod) => mod.default,
			);
		}
		case 'hu': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-hu" */ '../i18n/hu').then(
				(mod) => mod.default,
			);
		}
		case 'is': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-is" */ '../i18n/is').then(
				(mod) => mod.default,
			);
		}
		case 'it': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-it" */ '../i18n/it').then(
				(mod) => mod.default,
			);
		}
		case 'ja': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-ja" */ '../i18n/ja').then(
				(mod) => mod.default,
			);
		}
		case 'ko': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-ko" */ '../i18n/ko').then(
				(mod) => mod.default,
			);
		}
		case 'nb': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-nb" */ '../i18n/nb').then(
				(mod) => mod.default,
			);
		}
		case 'nl': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-nl" */ '../i18n/nl').then(
				(mod) => mod.default,
			);
		}
		case 'pl': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-pl" */ '../i18n/pl').then(
				(mod) => mod.default,
			);
		}
		case 'pt_BR':
		case 'pt-BR': {
			return import(
				/* webpackChunkName: "@atlaskit-internal_mention-i18n-pt_BR" */ '../i18n/pt_BR'
			).then((mod) => mod.default);
		}
		case 'pt_PT':
		case 'pt-PT': {
			return import(
				/* webpackChunkName: "@atlaskit-internal_mention-i18n-pt_PT" */ '../i18n/pt_PT'
			).then((mod) => mod.default);
		}
		case 'ro': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-ro" */ '../i18n/ro').then(
				(mod) => mod.default,
			);
		}
		case 'ru': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-ru" */ '../i18n/ru').then(
				(mod) => mod.default,
			);
		}
		case 'sk': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-sk" */ '../i18n/sk').then(
				(mod) => mod.default,
			);
		}
		case 'sv': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-sv" */ '../i18n/sv').then(
				(mod) => mod.default,
			);
		}
		case 'th': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-th" */ '../i18n/th').then(
				(mod) => mod.default,
			);
		}
		case 'tr': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-tr" */ '../i18n/tr').then(
				(mod) => mod.default,
			);
		}
		case 'uk': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-uk" */ '../i18n/uk').then(
				(mod) => mod.default,
			);
		}
		case 'vi': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-vi" */ '../i18n/vi').then(
				(mod) => mod.default,
			);
		}
		case 'zh_TW': {
			return import(
				/* webpackChunkName: "@atlaskit-internal_mention-i18n-zh_TW" */ '../i18n/zh_TW'
			).then((mod) => mod.default);
		}
		case 'zh': {
			return import(/* webpackChunkName: "@atlaskit-internal_mention-i18n-zh" */ '../i18n/zh').then(
				(mod) => mod.default,
			);
		}
		default: {
			const fragments = locale.split(/[_-]/);
			if (fragments.length === 2) {
				return getMessagesForLocale(fragments[0]);
			} else {
				return import(
					/* webpackChunkName: "@atlaskit-internal_mention-i18n-en" */ '../i18n/en'
				).then((mod) => mod.default);
			}
		}
	}
};
