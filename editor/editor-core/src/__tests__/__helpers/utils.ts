import {
  ProviderFactory,
  ProviderName,
} from '@atlaskit/editor-common/provider-factory';

export const isVisualRegression = () => !!process.env.VISUAL_REGRESSION;

export const waitForProvider = (providerFactory: ProviderFactory) => (
  providerName: ProviderName,
) =>
  new Promise(resolve => {
    const handler = (name: string, provider: any) => {
      if (providerName === name) {
        providerFactory.unsubscribe(providerName, handler);
        resolve(provider);
      }
    };
    providerFactory.subscribe(providerName, handler);
  });

export const flushPromises = () =>
  new Promise(resolve => setImmediate(resolve));
