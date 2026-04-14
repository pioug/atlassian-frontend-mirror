import React from 'react';

import Select, { components, type SingleValueProps } from '@atlaskit/select';

import defaultLocales from './default-locales';

export type Locale = {
	value: string;
	label: string;
};

export type LocaleSelectProps = {
	id?: string;
	locales?: Locale[];
	locale?: Locale;
	defaultLocale?: Locale;
	onLocaleChange?: (locale: Locale) => void;
};

const SingleValue = ({ children, ...props }: SingleValueProps<Locale, false>) => {
	const selectedLang = props.data.value;
	return (
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		<components.SingleValue {...props} innerProps={{ lang: selectedLang }}>
			{children}
		</components.SingleValue>
	);
};

const LocaleSelect = ({
	id,
	locales = defaultLocales,
	locale,
	defaultLocale = defaultLocales[0],
	// eslint-disable-next-line @repo/internal/react/use-noop
	onLocaleChange = () => {},
}: LocaleSelectProps): React.JSX.Element => (
	<Select<Locale>
		inputId={id}
		options={locales}
		value={locale}
		defaultValue={defaultLocale}
		onChange={(locale) => onLocaleChange(locale as Locale)}
		components={{ SingleValue }}
		styles={{
			container: (css: any) => ({ ...css, width: 300, margin: '0.5em 0' }),
			dropdownIndicator: (css: any) => ({ ...css, paddingLeft: 0 }),
			menu: (css: any) => ({ ...css, width: 300 }),
		}}
	/>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default LocaleSelect;
