/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
} from 'react';

import { jsx } from '@atlaskit/css';

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
