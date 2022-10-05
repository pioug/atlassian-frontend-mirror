import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

import {
  abortUfoExperience,
  startUfoExperience,
  ufoExperience,
} from '../../common/analytics/experiences';

export type LinkPickerSessionId = string;

export const INIT_CONTEXT = 'SESSION_UNINITIALIZED';

export const SessionContext = createContext<LinkPickerSessionId>(INIT_CONTEXT);

interface SessionProviderProps {
  children: ReactNode;
}

const useConstructor = (callback: () => void) => {
  const hasBeenFired = useRef(false);
  if (!hasBeenFired.current) {
    callback();
    hasBeenFired.current = true;
  }
  return null;
};

export const LinkPickerSessionProvider = ({
  children,
}: SessionProviderProps) => {
  const { current: sessionId } = useRef(uuidv4());

  useEffect(() => {
    return () => abortUfoExperience(ufoExperience.mounted, sessionId);
  }, [sessionId]);

  useConstructor(() => startUfoExperience(ufoExperience.mounted, sessionId));

  return (
    <SessionContext.Provider value={sessionId}>
      {children}
    </SessionContext.Provider>
  );
};

export const useLinkPickerSessionId = () =>
  useContext<LinkPickerSessionId>(SessionContext);
