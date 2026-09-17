import {
	createContext,
	useContext,
	type Context,
	type Dispatch,
	type MutableRefObject,
	type Provider,
	type SetStateAction,
} from 'react';

import noop from '@atlaskit/ds-lib/noop';

import type { FlyoutCloseSource } from './flyout-menu-item-content';

/**
 * __Is open context__
 *
 * A context for storing the isOpen value of the FlyoutMenuItem.
 */
export const IsOpenContext: Context<boolean> = createContext(false);

/**
 * __Set is open context__
 *
 * A context for storing a function that sets isOpen value of the FlyoutMenuItem.
 */
export const SetIsOpenContext: Context<(value: boolean) => void> =
	createContext<(value: boolean) => void>(noop);
export const useFlyoutMenuOpen = (): boolean => useContext(IsOpenContext);
export const useSetFlyoutMenuOpen = (): ((value: boolean) => void) => useContext(SetIsOpenContext);

/** Registers the initial focus target with the popup that owns focus restoration. */
export const SetInitialFocusRefContext: Context<
	Dispatch<SetStateAction<HTMLElement | null>> | undefined
> = createContext<Dispatch<SetStateAction<HTMLElement | null>> | undefined>(undefined);

/** The element focused when this flyout opens, before delayed content is available. */
export const InitialFocusOriginContext: Context<MutableRefObject<Element | null> | undefined> =
	createContext<MutableRefObject<Element | null> | undefined>(undefined);

/**
 * __On close context__
 *
 * A context for storing a ref to the onClose handler with source information.This
 * is used by FlyoutMenuItemContent, FlyoutMenuItemTrigger and FlyoutHeader to store
 * the on close function and source information for closing the flyout menu.
 */
export const OnCloseContext: Context<
	MutableRefObject<
		| ((
				event: Event | React.MouseEvent<HTMLButtonElement> | KeyboardEvent | MouseEvent | null,
				source?: FlyoutCloseSource,
		  ) => void)
		| null
	>
> = createContext<
	React.MutableRefObject<
		| ((
				event: Event | React.MouseEvent<HTMLButtonElement> | KeyboardEvent | MouseEvent | null,
				source?: FlyoutCloseSource,
		  ) => void)
		| null
	>
>({ current: null });

/**
 * __Title id context__
 *
 * A context for storing the title id of the FlyoutMenuItem that is displayed in
 * FlyoutHeader, and used as the aria-labelledby on the FlyoutMenuItemContent
 * container.
 */
export const TitleIdContext: Context<string | undefined> = createContext<string | undefined>(
	undefined,
);
export const useTitleId = (): string | undefined => useContext(TitleIdContext);

/**
 * __Title id provider__
 *
 * A context provider for supplying the title id to the FlyoutHeader.
 */
export const TitleIdContextProvider: Provider<string | undefined> = TitleIdContext.Provider;
