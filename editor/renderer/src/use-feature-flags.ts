import { RendererContextProps, useRendererContext } from './renderer-context';

export const useFeatureFlags = ():
  | RendererContextProps['featureFlags']
  | undefined => useRendererContext()?.featureFlags;
