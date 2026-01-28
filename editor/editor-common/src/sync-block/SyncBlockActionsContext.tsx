import React, { createContext, useContext, useMemo, type ReactNode } from 'react';

export interface SyncBlockActionsContextValue {
	deleteSyncBlock?: () => void;
	fetchSourceInfo: (
		sourceAri: string,
		hasAccess: boolean,
	) => Promise<{ title?: string; url?: string } | undefined>;
}

const SyncBlockActionsContext = createContext<SyncBlockActionsContextValue | null>(null);

export const useSyncBlockActions = () => {
	return useContext(SyncBlockActionsContext);
};

interface SyncBlockActionsProviderProps {
	children: ReactNode;
	fetchSyncBlockSourceInfo: (
		sourceAri: string,
	) => Promise<{ title?: string; url?: string } | undefined>;
	removeSyncBlock?: () => void;
}

export const SyncBlockActionsProvider = ({
	children,
	removeSyncBlock,
	fetchSyncBlockSourceInfo,
}: SyncBlockActionsProviderProps) => {
	const value = useMemo(
		() => ({
			deleteSyncBlock: removeSyncBlock,
			fetchSourceInfo: fetchSyncBlockSourceInfo,
		}),
		[removeSyncBlock, fetchSyncBlockSourceInfo],
	);

	return (
		<SyncBlockActionsContext.Provider value={value}>{children}</SyncBlockActionsContext.Provider>
	);
};
