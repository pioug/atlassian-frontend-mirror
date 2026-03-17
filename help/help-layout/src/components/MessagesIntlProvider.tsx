import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import {
	IntlProvider as ReactIntlNextProvider,
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
	<ReactIntlProvider key={`v6-${locale}`} locale={locale}>
		<ReactIntlNextProvider key={`v5-${locale}`} locale={locale}>
			{children}
		</ReactIntlNextProvider>
	</ReactIntlProvider>
);

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MessagesIntlProvider);
export default _default_1;
