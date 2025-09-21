/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useId,
	useState,
} from 'react';

import { jsx } from '@atlaskit/css';

import type { Placement } from '../types';

// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
interface SpotlightContextType {
	placement: Placement;
	setPlacement: Dispatch<SetStateAction<Placement>>;
	heading: {
		id: string;
		setId: Dispatch<SetStateAction<string>>;
	};
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContext = createContext<SpotlightContextType>({
	placement: 'bottom-end',
	setPlacement: () => undefined,
	heading: {
		id: '',
		setId: () => undefined,
	},
});

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SpotlightContextProvider = ({ children }: { children: ReactNode }) => {
	const id = useId();
	const [placement, setPlacement] = useState<Placement>('bottom-end');
	const [headingId, setHeadingId] = useState<string>(`${id}-heading`);

	return (
		<SpotlightContext.Provider
			value={{
				placement,
				setPlacement,
				heading: {
					id: headingId,
					setId: setHeadingId,
				},
			}}
		>
			{children}
		</SpotlightContext.Provider>
	);
};
