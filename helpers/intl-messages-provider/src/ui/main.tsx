import React, { useMemo } from 'react';

import { IntlProvider } from 'react-intl-next';

import { useMessages } from '../services/use-messages';
import { useSafeIntl } from '../services/use-safe-intl';

import { type IntlMessagesProviderProps } from './types';

export default function IntlMessagesProvider({
	loaderFn,
	children,
	defaultMessages,
}: IntlMessagesProviderProps) {
	const intl = useSafeIntl();
	const messages = useMessages(intl.locale, loaderFn);

	/**
	 * IntlProvider does not inherit from upstream IntlProviders,
	 * we lookup messages in the context and pass them downstream
	 * This prevents the missing messages error
	 */
	const mergedMessages = useMemo(() => {
		return { ...defaultMessages, ...intl.messages, ...messages };
	}, [intl, messages, defaultMessages]);

	return (
		<IntlProvider
			defaultLocale="en"
			locale={intl.locale}
			onError={intl.onError}
			messages={mergedMessages}
		>
			{children}
		</IntlProvider>
	);
}
