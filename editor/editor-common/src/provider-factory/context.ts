import React from 'react';

import ProviderFactory from './provider-factory';
import { ProviderType } from './types';

const ProviderFactoryContext = React.createContext<ProviderFactory>(
  new ProviderFactory(),
);

export const ProviderFactoryProvider = ProviderFactoryContext.Provider;

export const useProviderFactory = () =>
  React.useContext(ProviderFactoryContext);

export const useProvider = <T extends string>(
  name: T,
): ProviderType<typeof name> | undefined => {
  const [provider, setProvider] = React.useState<ProviderType<typeof name>>();
  const providerFactory = useProviderFactory();

  React.useEffect(() => {
    const providerHandler = (
      _: typeof name,
      provider?: ProviderType<typeof name>,
    ) => {
      setProvider(provider);
    };

    providerFactory.subscribe(name, providerHandler);
    return () => {
      providerFactory.unsubscribe(name, providerHandler);
    };
  }, [name, providerFactory]);

  return provider;
};
