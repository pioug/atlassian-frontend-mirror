/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Popup from '../../src';

const contentStyles = css({
  padding: token('space.200', '16px'),
});

const PopupContentWithoutPortalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popup
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-start"
      content={() => <div css={contentStyles}>Content</div>}
      shouldRenderToParent
      trigger={(triggerProps) => (
        <Button
          {...triggerProps}
          appearance="primary"
          isSelected={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close' : 'Open'} popup{' '}
        </Button>
      )}
    />
  );
};

export default PopupContentWithoutPortalExample;
