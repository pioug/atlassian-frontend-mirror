/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { bindAll, UnbindFn } from 'bind-event-listener';

import Button from '@atlaskit/button';
import { CodeBlock } from '@atlaskit/code';
import SectionMessage from '@atlaskit/section-message';
import { token } from '@atlaskit/tokens';

import Portal, {
  PORTAL_MOUNT_EVENT,
  PORTAL_UNMOUNT_EVENT,
  type PortalEvent,
} from '../../src';

const containerStyles = css({
  margin: token('space.200', '16px'),
});

const verticalSpaceContainerStyles = css({
  marginBottom: token('space.200', '16px'),
});

const portalContentStyles = css({
  margin: `${token('space.0', '0')} ${token('space.200', '16px')} ${token(
    'space.200',
    '16px',
  )}`,
});

const figureStyles = css({
  margin: token('space.0', '0'),
});

const PortalEventExample = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [customEventData, setCustomEventData] = useState('');

  useEffect(() => {
    const portalEventListener = ((event: PortalEvent) => {
      const { type, detail } = event;

      setCustomEventData(JSON.stringify({ type, detail }));
    }) as EventListener;

    const unbind: UnbindFn = bindAll(window, [
      {
        type: PORTAL_MOUNT_EVENT,
        listener: portalEventListener,
      },
      {
        type: PORTAL_UNMOUNT_EVENT,
        listener: portalEventListener,
      },
    ]);

    return unbind;
  }, []);

  return (
    <div css={containerStyles}>
      <div css={verticalSpaceContainerStyles}>
        <Button appearance="primary" onClick={() => setIsMounted(!isMounted)}>
          {isMounted ? 'Unmount' : 'Mount'} portal
        </Button>
      </div>
      <div>
        <figure css={figureStyles}>
          <figcaption>PortalEvent specific data:</figcaption>
          <CodeBlock language="JSON" text={customEventData} />
        </figure>
      </div>
      {isMounted && (
        <Portal>
          <div css={portalContentStyles}>
            <SectionMessage>I am inside portal!</SectionMessage>
          </div>
        </Portal>
      )}
    </div>
  );
};

export default PortalEventExample;
