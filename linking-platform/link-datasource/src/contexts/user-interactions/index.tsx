import React, { type PropsWithChildren, useContext, useMemo, useRef } from 'react';

import { type DatasourceAction } from '../../analytics/types';

interface UserInteractions {
  add: (action: DatasourceAction) => void,
  get: () => DatasourceAction[],
}

const UserInteractionsContext =
  React.createContext<UserInteractions | undefined>(undefined);

const UserInteractionsProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const userInteractionActions = useRef<Set<DatasourceAction>>(new Set());

  const providerValue = useMemo(() => {
    return {
      add: (action: DatasourceAction) => {
        userInteractionActions.current.add(action);
      },
      get: () => Array.from(userInteractionActions.current),
    }
  }, [])
  return (
    <UserInteractionsContext.Provider value={providerValue}>
      {children}
    </UserInteractionsContext.Provider>
  );
};

/**
 * Use this hook to track user activities. This is mainly used to populate analytic events with
 * a trail of user activities.
 *
 * @returns an object that can track datasource actions and retrieve the actions that have been tracked.
 */
const useUserInteractions = () => {
  const context = useContext(UserInteractionsContext);
  if (!context) {
    throw new Error('useUserInteractions() must be wrapped in <UserInteractionsProvider>');
  }
  return context;
};

export { UserInteractionsProvider, useUserInteractions };
