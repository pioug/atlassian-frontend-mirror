import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { LoadUserSource, UserSource } from '../types';

export interface UserSourceContext {
  fetchUserSource?: LoadUserSource;
}

const ExusUserSourceContext = createContext<Partial<UserSourceContext>>({});

export const ExusUserSourceProvider: React.FC<UserSourceContext> = ({
  fetchUserSource,
  children,
}) => (
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
  const [sources, setUserSources] = useState<Set<UserSource>>(
    new Set(existingSources),
  );
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

    if (isMounted) {
      fetchUserSource(accountId, abortController?.signal)
        .then((externalSources) => {
          setLoading(false);
          const externalSourceTypes = externalSources.map(
            (source) => source.sourceType,
          );
          setUserSources(new Set([...sources, ...externalSourceTypes]));
        })
        .catch((error) => {
          setLoading(false);
          setError(error);
        });
    }

    return cleanup;
  }, [
    fetchUserSource,
    accountId,
    sources,
    abortController,
    shouldFetchSources,
  ]);

  return { sources: Array.from(sources), loading, error };
};
