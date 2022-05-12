import { useSmartLinkContext, CardContext } from '@atlaskit/link-provider';

export const useSmartLinkConfig = (): CardContext['config'] | undefined => {
  const context = useSmartLinkContext();
  if (context) {
    return context.config;
  }
  return undefined;
};
