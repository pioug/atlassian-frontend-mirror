import React from 'react';
import { IntlProvider, injectIntl, type WrappedComponentProps } from 'react-intl-next';

export interface Props {
	children: React.ReactNode;
	locale?: string;
}

export const MessagesIntlProvider: React.FC<Props & WrappedComponentProps> = ({
	locale = 'en',
	children,
}) => (
	<IntlProvider key={locale} locale={locale}>
		{children}
	</IntlProvider>
);

export default injectIntl(MessagesIntlProvider);
