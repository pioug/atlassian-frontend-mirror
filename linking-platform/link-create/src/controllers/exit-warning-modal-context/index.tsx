import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

type ExitWarningModalContextValue = {
	getShouldShowWarning: () => boolean;
	setShouldShowWarning: (show: boolean) => void;
	showExitWarning: boolean;
	setShowExitWarning: React.Dispatch<React.SetStateAction<boolean>>;
	withExitWarning: (callback?: () => void) => () => boolean;
};

const ExitWarningModalContext = createContext<ExitWarningModalContextValue>({
	getShouldShowWarning: () => false,
	setShouldShowWarning: () => {},
	showExitWarning: false,
	setShowExitWarning: () => false,
	withExitWarning: () => () => false,
});

export const ExitWarningModalProvider = ({ children }: { children: React.ReactNode }) => {
	const [showExitWarning, setShowExitWarning] = useState(false);

	const shouldShowWarning = useRef(false);

	const getShouldShowWarning = useCallback(() => shouldShowWarning.current, []);

	const setShouldShowWarning = useCallback((show: boolean) => {
		shouldShowWarning.current = show;
	}, []);

	const withExitWarning = useCallback(
		(callback?: (_: boolean) => void) => () => {
			if (shouldShowWarning.current && !showExitWarning) {
				setShowExitWarning(true);
				return false;
			}

			setShowExitWarning(false);
			callback?.(true);
			return true;
		},
		[showExitWarning],
	);

	const value = useMemo(
		() => ({
			getShouldShowWarning,
			setShouldShowWarning,
			showExitWarning,
			setShowExitWarning,
			withExitWarning,
		}),
		[
			getShouldShowWarning,
			setShouldShowWarning,
			showExitWarning,
			setShowExitWarning,
			withExitWarning,
		],
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

export const useWithExitWarning = () => {
	const value = useContext(ExitWarningModalContext);

	if (!value) {
		throw new Error('useWithExitWarning used outside of ExitWarningModalProvider');
	}

	const { withExitWarning } = value;

	return withExitWarning;
};
