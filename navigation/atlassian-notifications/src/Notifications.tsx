/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useEffect, useState, useRef, SyntheticEvent } from 'react';

import { iframeCSS } from './styles';
import { NotificationsProps } from './types';
import { getNotificationsSrc } from './utils';

export const Notifications = (props: NotificationsProps) => {
  const { _url, locale, product, testId, ...iframeProps } = props;
  const ref = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);

  const onMessage = (event: MessageEvent) => {
    if (!ref.current || !event.source) {
      return;
    }

    if (
      (event.source as WindowProxy).window === ref.current.contentWindow &&
      event.data === 'readyForUser'
    ) {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const onLoad = (...args: [SyntheticEvent<HTMLIFrameElement>]) => {
    setLoading(false);
    if (iframeProps.onLoad) {
      iframeProps.onLoad(...args);
    }
  };

  return (
    <iframe
      {...iframeProps}
      css={iframeCSS({ loading })}
      data-testid={testId}
      onLoad={onLoad}
      ref={ref}
      src={getNotificationsSrc({ _url, locale, product })}
    />
  );
};
