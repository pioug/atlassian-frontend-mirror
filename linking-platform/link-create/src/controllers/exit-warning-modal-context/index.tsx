import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';

type ExitWarningModalContextValue = {
	getShouldShowWarning: () => boolean;
	setShouldShowWarning: (show: boolean) => void;
};

const ExitWarningModalContext = createContext<ExitWarningModalContextValue>({
	getShouldShowWarning: () => false,
	setShouldShowWarning: () => {},
});

export const ExitWarningModalProvider = ({ children }: { children: React.ReactNode }) => {
	const shouldShowWarning = useRef(false);

	const getShouldShowWarning = useCallback(() => shouldShowWarning.current, []);

	const setShouldShowWarning = useCallback((show: boolean) => {
		shouldShowWarning.current = show;
	}, []);

	const value = useMemo(
		() => ({
			getShouldShowWarning,
			setShouldShowWarning,
		}),
		[getShouldShowWarning, setShouldShowWarning],
	);

	return (
		<ExitWarningModalContext.Provider value={value}>{children}</ExitWarningModalContext.Provider>
	);
};

export const useExitWarningModal = () => {
	const value = useContext(ExitWarningModalContext);

	if (!value) {
		throw new Error('useExitWarningModal used outside of ExitWarningModalProvider');
	}

	return value;
};
