import React from 'react';
import { IntlProvider, injectIntl, type WrappedComponentProps } from 'react-intl-next';

export interface Props {
	locale?: string;
	children: React.ReactNode;
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
