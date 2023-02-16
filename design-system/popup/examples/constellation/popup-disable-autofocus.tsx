/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import Textfield from '@atlaskit/textfield';
import { token } from '@atlaskit/tokens';

import Popup from '../../src';

const wrapperStyles = css({
  display: 'grid',
  alignItems: 'center',
  gap: token('space.200', '16px'),
  gridTemplateColumns: '1fr auto',
});

const contentStyles = css({
  maxWidth: 200,
  padding: token('space.200', '16px'),
});

const PopupDisableAutofocusExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div css={wrapperStyles}>
      <Textfield placeholder="This should stay focused when the popup opens" />
      <Popup
        autoFocus={false}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={() => (
          <div css={contentStyles}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam
            massa ac risus scelerisque, in iaculis magna semper. Phasellus
            sagittis congue elit, non suscipit nulla rhoncus vitae.
          </div>
        )}
        trigger={(triggerProps) => (
          <Button
            {...triggerProps}
            appearance="primary"
            isSelected={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} popup
          </Button>
        )}
        placement="bottom"
      />
    </div>
  );
};

export default PopupDisableAutofocusExample;
