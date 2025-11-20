import React, { useState } from 'react';
import { IntlProvider } from 'react-intl-next';
import LocaleSelect, { type Locale, defaultLocales } from '@atlaskit/locale/LocaleSelect';
import { locales } from '@atlaskit/media-ui/locales';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';
import { Label } from '@atlaskit/form';

function getMessages(localeValue: string) {
	const lang = localeValue.substring(0, 2);
	const langWithRegion = localeValue.replace('-', '_');
	return locales[langWithRegion] || locales[lang];
}

const findLocale = (initialLocale: string | undefined) =>
	defaultLocales.find((locale) => locale.value === initialLocale) ||
	(initialLocale && defaultLocales.find((locale) => locale.value.includes(initialLocale)));

export interface I18NWrapperState {
	locale: Locale;
}

export interface I18NWrapperProps {
	children: React.ReactNode;
	initialLocale?: string;
}

const defaultLocale = defaultLocales[0];

export const I18NWrapper = ({ children, initialLocale }: I18NWrapperProps): React.JSX.Element => {
	const [locale, setLocale] = useState<Locale>(findLocale(initialLocale) || defaultLocale);

	const lang = locale.value;
	const messages = getMessages(locale.value);
	return (
		<>
			<Box xcss={localeBoxStyles}>
				<Label htmlFor="media-locale-select">Language</Label>
				<LocaleSelect id="media-locale-select" onLocaleChange={setLocale} defaultLocale={locale} />
			</Box>
			<IntlProvider
				locale={lang}
				messages={messages}
				// We need to add this key to force a re-render and refresh translations
				// when selected language has changed
				key={locale.value}
			>
				<>{children}</>
			</IntlProvider>
		</>
	);
};

const localeBoxStyles = xcss({ marginBottom: 'space.150', marginTop: 'space.150' });
