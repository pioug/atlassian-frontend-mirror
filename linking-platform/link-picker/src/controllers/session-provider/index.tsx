import React, { createContext, type ReactNode, useContext, useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as uuidv4 } from 'uuid';

import {
	abortUfoExperience,
	startUfoExperience,
	ufoExperience,
} from '../../common/analytics/experiences';

export type LinkPickerSessionId = string;

export const INIT_CONTEXT = 'SESSION_UNINITIALIZED';

export const SessionContext: React.Context<string> =
	createContext<LinkPickerSessionId>(INIT_CONTEXT);

interface SessionProviderProps {
	children: ReactNode;
}

export const LinkPickerSessionProvider = ({
	children,
}: SessionProviderProps): React.JSX.Element => {
	// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
	const { current: sessionId } = useRef(uuidv4());

	useEffect(() => {
		startUfoExperience(ufoExperience.mounted, sessionId);
		return () => abortUfoExperience(ufoExperience.mounted, sessionId);
	}, [sessionId]);

	return <SessionContext.Provider value={sessionId}>{children}</SessionContext.Provider>;
};

export const useLinkPickerSessionId = (): string => useContext<LinkPickerSessionId>(SessionContext);
