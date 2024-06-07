import React, { type ComponentClass, type FunctionComponent } from 'react';

import { IntlProvider } from 'react-intl-next';

type WithIntlProviderProps = {
	/**
	 * React-intl locale. This should be set to "en" if alternate message sets are not being loaded higher in the React
	 * tree.
	 */
	locale?: string;
};

export const withIntlProvider = <Props extends WithIntlProviderProps>(
	WrappedComponent:
		| FunctionComponent<Omit<Props, 'locale'>>
		| ComponentClass<Omit<Props, 'locale'>>,
) => {
	return (props: Props) => {
		const { locale, ...rest } = props;

		if (locale) {
			return (
				<IntlProvider locale={locale}>
					<WrappedComponent {...rest} />
				</IntlProvider>
			);
		}

		return <WrappedComponent {...rest} />;
	};
};
