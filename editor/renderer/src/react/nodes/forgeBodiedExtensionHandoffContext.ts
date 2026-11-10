import { createContext, type Context } from 'react';

/** Instances whose native body stays visible until ready: localId -> extensionKey. Undefined disables it. */
export const ForgeBodiedExtensionHandoffContext: Context<ReadonlyMap<string, string> | undefined> =
	createContext<ReadonlyMap<string, string> | undefined>(undefined);

/** Only the matching instance may release its preserved native body. */
export const ForgeBodiedExtensionHandoffReadyContext: Context<
	{ localId: string; onReady: () => void } | undefined
> = createContext<{ localId: string; onReady: () => void } | undefined>(undefined);
