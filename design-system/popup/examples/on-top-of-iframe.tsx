/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Popup from '../src';

const popupStyles = css({
  width: 175,
  height: 250,
});

const containerStyles = css({
  width: '100%',
  height: '100%',
});

const iframeStyles = css({
  width: '100%',
  height: '7rem',
});

const stubIframeStyles = css({
  background: token('color.background.accent.yellow.bolder', '#946F00'),
});

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div css={containerStyles}>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        placement="bottom-start"
        content={() => <div css={popupStyles} />}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            Popup Trigger
          </Button>
        )}
      />
      <iframe
        css={iframeStyles}
        title="ADIframe"
        src="https://atlassian.design/"
      />
      <iframe css={[iframeStyles, stubIframeStyles]} title="stubIframe" />
    </div>
  );
};
