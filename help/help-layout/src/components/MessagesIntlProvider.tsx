import React from 'react';
import {
	IntlProvider,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl-next';

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

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MessagesIntlProvider);
export default _default_1;
