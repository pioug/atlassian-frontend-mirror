import { Provider } from './provider';
import { default as ServiceProvider } from './service-provider';
export { ServiceProvider };
export type { Provider };

export interface ProviderProps {
  provider?: Provider;
  url?: string;
}

export const getProvider = ({ provider, url }: ProviderProps): Provider => {
  if (provider) {
    return provider;
  }

  if (url) {
    return new ServiceProvider({ url });
  }

  throw new Error('Missing provider');
};
