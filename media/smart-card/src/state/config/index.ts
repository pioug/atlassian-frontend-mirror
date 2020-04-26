import { useSmartLinkContext, CardContext } from '../context';

export const useSmartLinkConfig = (): CardContext['config'] | undefined => {
  const context = useSmartLinkContext();
  if (context) {
    return context.config;
  }
  return undefined;
};
