import { useEffect } from 'react';

import { PORTAL_MOUNT_EVENT, PORTAL_UNMOUNT_EVENT } from '../../constants';
import firePortalEvent from '../utils/portal-custom-event';

const useFirePortalEvent = (zIndex: number | string) => {
  const zIndexNumber = Number(zIndex);
  useEffect(() => {
    firePortalEvent(PORTAL_MOUNT_EVENT, zIndexNumber);

    return () => {
      firePortalEvent(PORTAL_UNMOUNT_EVENT, zIndexNumber);
    };
  }, [zIndexNumber]);
};
export default useFirePortalEvent;
