/** @jsx jsx */
import { useEffect } from 'react';

import { SkipLinkData, useSkipLinks } from '../../controllers';

export const useCustomSkipLink = (
  id: SkipLinkData['id'],
  skipLinkTitle: SkipLinkData['skipLinkTitle'],
  listIndex: SkipLinkData['listIndex'] = 0,
) => {
  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  registerSkipLink({ id, skipLinkTitle, listIndex });

  useEffect(() => {
    return () => {
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, listIndex, skipLinkTitle]);
};
