import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type LoadUserSource, type UserSource } from '../types';

export interface UserSourceContext {
  fetchUserSource?: LoadUserSource;
}

const ExusUserSourceContext = createContext<Partial<UserSourceContext>>({});

export const ExusUserSourceProvider = ({
  fetchUserSource,
  children,
}: PropsWithChildren<UserSourceContext>) => (
  <ExusUserSourceContext.Provider value={{ fetchUserSource }}>
    {children}
  </ExusUserSourceContext.Provider>
);

export const useUserSource = (
  accountId: string,
  shouldFetchSources: boolean,
  existingSources?: UserSource[],
) => {
  const { fetchUserSource } = useContext(ExusUserSourceContext);
  const [externalSources, setExternalSources] = useState([] as UserSource[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortController = useMemo(() => {
    if (typeof AbortController === 'undefined') {
      return;
    }
    return new AbortController();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const cleanup = () => {
      abortController?.abort();
      isMounted = false;
    };

    if (!fetchUserSource || !shouldFetchSources) {
      setLoading(false);
      return cleanup;
    }

    fetchUserSource(accountId, abortController?.signal)
      .then((externalSources) => {
        if (!isMounted) {
          return;
        }
        setLoading(false);
        const externalSourceTypes = externalSources.map(
          (source) => source.sourceType,
        );
        setExternalSources(externalSourceTypes);
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        setLoading(false);
        setError(error);
      });

    return cleanup;
  }, [fetchUserSource, accountId, abortController, shouldFetchSources]);

  return useMemo(
    () => ({
      sources: Array.from(
        new Set([...(existingSources ?? []), ...externalSources]),
      ),
      loading,
      error,
    }),
    [error, existingSources, externalSources, loading],
  );
};
