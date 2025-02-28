import React, { useCallback, useContext, useMemo, useState } from 'react';

import AutoDismissFlag from './auto-dismiss-flag';
import Flag from './flag';
import FlagGroup from './flag-group';
import { type FlagPropsWithoutId } from './types';

type FlagId = string | number;

export type Combine<First, Second> = Omit<First, keyof Second> & Second;

export interface CreateFlagArgs extends FlagPropsWithoutId {
	/**
	 * A unique identifier used for rendering and onDismissed callbacks.
	 * This will be autogenerated if you don’t supply one.
	 * If you don’t want the same flag showing multiple times, provide a unique id.
	 */
	id?: FlagId;
	/**
	 * Marks whether the flag should render as an AutoDismissFlag
	 */
	isAutoDismiss?: boolean;
}

export type FlagArgs = Combine<CreateFlagArgs, { id: FlagId }>;

export type DismissFn = () => void;

export type FlagAPI = {
	showFlag: (args: CreateFlagArgs) => DismissFn;
};

const FlagContext = React.createContext<FlagAPI | null>(null);

/**
 * useFlags is used to access the `showFlags` function which can be used to programatically display flags.
 * - [Examples](https://atlassian.design/components/flag/flags-provider/examples#using-showflags)
 */
export function useFlags() {
	const api: FlagAPI | null = useContext(FlagContext);
	if (api == null) {
		throw new Error('Unable to find FlagProviderContext');
	}

	return api;
}

const getUniqueId = (() => {
	let count: number = 0;
	return () => `flag-provider-unique-id:${count++}`;
})();

export function FlagsProvider({
	children,
	shouldRenderToParent,
}: {
	children: React.ReactNode;
	shouldRenderToParent?: boolean;
}) {
	const [flags, setFlags] = useState<FlagArgs[]>([]);

	const removeFlag = useCallback((id: FlagId) => {
		setFlags((current) => {
			return current.slice(0).filter((flag) => flag.id !== id);
		});
	}, []);

	const api: FlagAPI = useMemo(
		() => ({
			showFlag: function show(value: CreateFlagArgs) {
				const flag: FlagArgs = {
					...value,
					id: value.id || getUniqueId(),
				};

				setFlags((current): FlagArgs[] => {
					const index: number = current.findIndex((value) => value.id === flag.id);

					// If flag is not found add it
					if (index === -1) {
						return [flag, ...current];
					}

					// If flag already exists with the same id, then replace it
					const shallow: FlagArgs[] = [...current];
					shallow[index] = flag;
					return shallow;
				});

				return function dismiss() {
					removeFlag(flag.id);
				};
			},
		}),
		[removeFlag],
	);

	return (
		<>
			<FlagContext.Provider value={api}>{children}</FlagContext.Provider>
			<FlagGroup onDismissed={removeFlag} shouldRenderToParent={shouldRenderToParent}>
				{flags.map((flag) => {
					const { isAutoDismiss, ...restProps } = flag;
					const FlagType = isAutoDismiss ? AutoDismissFlag : Flag;
					return <FlagType {...restProps} key={flag.id} />;
				})}
			</FlagGroup>
		</>
	);
}

export const withFlagsProvider = (fn: () => React.ReactNode) => (
	<FlagsProvider>{fn()}</FlagsProvider>
);
