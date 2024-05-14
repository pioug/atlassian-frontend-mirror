import { useSmartLinkContext } from '@atlaskit/link-provider';
import { AISummaryConfig } from './types';
import { useMemo } from 'react';

export const useAISummaryConfig = (): AISummaryConfig => {
  const { product, isAdminHubAIEnabled } = useSmartLinkContext();

  return useMemo(
    () => ({
      product,
      isAdminHubAIEnabled,
    }),
    [product, isAdminHubAIEnabled],
  );
};
