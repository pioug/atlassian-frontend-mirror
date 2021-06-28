import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
  useMemo,
} from 'react';
import {
  EmitterEvents,
  eventDispatcher as mobileBridgeEventDispatcher,
} from '../dispatcher';
import { HeadingAnchorLinksProps } from '@atlaskit/renderer';

export function useHeadingLinks(
  allowHeadingAnchorLinks: boolean,
): HeadingAnchorLinksProps {
  const [activeHeadingId, setActiveHeadingId] = useState<undefined | string>();

  const receiveNewActiveHeadingId = useCallback((headingId) => {
    setActiveHeadingId(headingId);
  }, []);

  useEffect(() => {
    if (activeHeadingId) {
      setActiveHeadingId(undefined);
    }
  }, [activeHeadingId]);

  useLayoutEffect(() => {
    if (!Boolean(allowHeadingAnchorLinks)) {
      return;
    }

    mobileBridgeEventDispatcher.on(
      EmitterEvents.SET_ACTIVE_HEADING_ID,
      receiveNewActiveHeadingId,
    );

    return () => {
      mobileBridgeEventDispatcher.off(
        EmitterEvents.SET_ACTIVE_HEADING_ID,
        receiveNewActiveHeadingId,
      );
    };
  });

  const config = useMemo(
    () => ({
      allowNestedHeaderLinks: true,
      activeHeadingId,
    }),
    [activeHeadingId],
  );

  return Boolean(allowHeadingAnchorLinks) ? config : false;
}
