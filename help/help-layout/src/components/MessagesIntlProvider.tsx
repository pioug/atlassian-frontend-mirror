import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import {
	IntlProvider as ReactIntlNextProvider,
	injectIntl,
	type WithIntlProps,
	type WrappedComponentProps,
} from 'react-intl';

export interface Props {
	children: React.ReactNode;
	locale?: string;
}

export const MessagesIntlProvider: React.FC<Props & WrappedComponentProps> = ({
	locale,
	children,
	intl,
}) => {
	const resolvedLocale = locale ?? intl.locale ?? 'en';
	const messages = intl.messages;

	return (
		<ReactIntlProvider key={`v6-${resolvedLocale}`} locale={resolvedLocale} messages={messages}>
			<ReactIntlNextProvider
				key={`v5-${resolvedLocale}`}
				locale={resolvedLocale}
				messages={messages}
			>
				{children}
			</ReactIntlNextProvider>
		</ReactIntlProvider>
	);
};

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(MessagesIntlProvider);
export default _default_1;
