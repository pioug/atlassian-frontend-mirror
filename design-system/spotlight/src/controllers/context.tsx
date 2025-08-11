import React, {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
} from 'react';

import type { Placement } from '../types';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
interface SpotlightContextType {
	placement: Placement;
	setPlacement: Dispatch<SetStateAction<Placement>>;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContext = createContext<SpotlightContextType>({
	placement: 'bottom-end',
	setPlacement: () => undefined,
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContextProvider = ({ children }: { children: ReactNode }) => {
	const [placement, setPlacement] = useState<Placement>('bottom-end');

	return (
		<SpotlightContext.Provider value={{ placement, setPlacement }}>
			{children}
		</SpotlightContext.Provider>
	);
};

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
interface TourContextType {
	currentStep: number | undefined;
	setCurrentStep: Dispatch<SetStateAction<number | undefined>>;
	next: () => void;
	prev: () => void;
}

/**
 * __Tour context__
 *
 * A tour context is a way of managing multiple spotlights as steps in the same tour.
 *
 */
export const TourContext = createContext<TourContextType>({
	currentStep: 1,
	setCurrentStep: () => undefined,
	next: () => undefined,
	prev: () => undefined,
});

/**
 * __Tour context provider__
 *
 * A tour context provider is a way of managing multiple spotlights as steps in the same tour.
 *
 */
export const TourContextProvider = ({ children }: { children: ReactNode }) => {
	const [currentStep, setCurrentStep] = useState<number | undefined>(1);

	const next = () => {
		if (!currentStep) {
			setCurrentStep(1);
			return;
		}
		setCurrentStep(currentStep + 1);
	};

	const prev = () => {
		if (!currentStep) {
			setCurrentStep(1);
			return;
		}
		setCurrentStep(currentStep - 1);
	};

	return (
		<TourContext.Provider value={{ currentStep, setCurrentStep, next, prev }}>
			{children}
		</TourContext.Provider>
	);
};
