import React, { type ReactNode } from 'react';

import IntlMessagesProvider from './main';
import { type I18NMessages } from './types';

/**
 * A map of locale code -> dynamic import of that locale's i18n message bundle.
 *
 * Each entry is a function that returns a promise resolving to the message
 * module (with messages on its `default` export). Using thunks ensures the
 * bundler can code-split each locale into its own chunk.
 *
 * Example:
 * ```ts
 * const asyncLanguages: AsyncLanguagesMap = {
 *   de: () => import('../i18n/de'),
 *   fr: () => import('../i18n/fr'),
 * };
 * ```
 */
export type AsyncLanguagesMap = Record<string, () => Promise<unknown> | unknown>;

export interface CreateAsyncIntlProviderOptions {
	/**
	 * A map of locale code -> dynamic import returning the locale's message
	 * bundle on its `default` export.
	 */
	asyncLanguages: AsyncLanguagesMap;
	/**
	 * The default (English) messages used as a fallback when the requested
	 * locale cannot be found or fails to load.
	 */
	defaultMessages: I18NMessages;
	/**
	 * Optional callback invoked when loading messages for a locale fails.
	 * Useful for emitting analytics or logging.
	 */
	onLoadError?: (locale: string, error: unknown) => void;
}

export interface AsyncIntlProviderProps {
	children: ReactNode;
	/**
	 * When true, this provider becomes a passthrough and does not render an
	 * `IntlMessagesProvider`. Useful for products (such as Jira) that already
	 * provide their own intl context and do not want this package's loader
	 * to run.
	 */
	disabled?: boolean;
}

export type AsyncIntlProviderComponent = (props: AsyncIntlProviderProps) => React.JSX.Element;

/**
 * Factory that produces an `AsyncIntlProvider` component pre-configured with
 * a package's default messages and locale loader map.
 *
 * Use this to avoid hand-rolling an `IntlMessagesProvider` wrapper inside
 * every package that ships its own translations. The returned component:
 *
 * - Looks up the requested locale in the `asyncLanguages` map (with a
 *   fallback from `xx-YY` to `xx`).
 * - Falls back to `defaultMessages` if the locale is unknown or fails to load.
 * - Reports load failures via the optional `onLoadError` callback.
 * - Can be disabled at the call site via the `disabled` prop, in which case
 *   it renders its children unchanged.
 *
 * This function will be called once upon module-load, so we are not concerned about the
 * inline arrow-function definition.
 *
 * @example
 * ```tsx
 * import { createAsyncIntlProvider } from '@atlaskit/intl-messages-provider/async';
 * import messages from '../../i18n/en';
 * import { asyncLanguages } from './async-languages';
 *
 * export const AsyncIntlProvider = createAsyncIntlProvider({
 *     defaultMessages: messages,
 *     asyncLanguages,
 * });
 * ```
 */
export function createAsyncIntlProvider({
	defaultMessages,
	asyncLanguages,
	onLoadError,
}: CreateAsyncIntlProviderOptions): AsyncIntlProviderComponent {
	const fetchMessagesForLocale = async (locale: string): Promise<I18NMessages | undefined> => {
		try {
			// Fallback to the generic locale (e.g. `de`) if the specified
			// region-qualified locale (e.g. `de-DE`) is not present in the map.
			const languageLocale = locale in asyncLanguages ? locale : locale.split(/[-_]/)[0] || '';

			const localeMessages = (await asyncLanguages[languageLocale]?.()) as
				| { default: I18NMessages }
				| undefined;

			return localeMessages?.default ?? defaultMessages;
		} catch (e) {
			onLoadError?.(locale, e);
		}

		return defaultMessages;
	};

	return function AsyncIntlProvider({
		children,
		disabled = false,
	}: AsyncIntlProviderProps): React.JSX.Element {
		if (disabled) {
			return <>{children}</>;
		}

		// `fetchMessagesForLocale` is defined once at factory-call time and
		// closed over here, so its identity is already stable across renders
		// of this returned component — no `useCallback` needed.
		return (
			<IntlMessagesProvider defaultMessages={defaultMessages} loaderFn={fetchMessagesForLocale}>
				{children}
			</IntlMessagesProvider>
		);
	};
}
