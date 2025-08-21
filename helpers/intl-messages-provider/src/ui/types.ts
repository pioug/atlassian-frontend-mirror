import { type MessageFormatElement } from 'react-intl-next';

export type I18NMessages = Record<string, string> | Record<string, MessageFormatElement[]>;

export type IntlMessagesProviderProps = {
	/**
	 * Your wrapped Component
	 */
	children?: React.ReactNode;
	/**
	 * On first render the messages in IntlProvider will be undefined,
	 * to prevent the missing translations error use defaultMessages to
	 * pass the default language messages object synchronously.
	 *
	 * Does not override the messages that are inherited from
	 * the parent `intl` provider, if there are any
	 */
	defaultMessages?: I18NMessages;
	/**
	 * Use this function to asynchronously load translated messages
	 * from your package and feed them to our internal IntlProvider
	 * This will enable translations in Product
	 */
	loaderFn: (locale: string) => Promise<I18NMessages | undefined>;
};
