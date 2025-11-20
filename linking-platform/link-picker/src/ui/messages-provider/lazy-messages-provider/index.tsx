import React from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';

import en from '../../../i18n/en';

import { fetchMessagesForLocale } from './utils/fetch-messages-for-locale';

type LazyMessagesProviderProps = {
	children?: React.ReactNode;
};

export const LazyMessagesProvider = ({
	children,
}: LazyMessagesProviderProps): React.JSX.Element => {
	return (
		<IntlMessagesProvider defaultMessages={en} loaderFn={fetchMessagesForLocale}>
			{children}
		</IntlMessagesProvider>
	);
};
