/** @jsx jsx */
import { FC, Fragment, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import Popup from '../src';

const spacerStyles = css({
  margin: '250px',
});

const sizedContentStyles = css({
  padding: '10px',
  alignItems: 'center',
  textAlign: 'center',
  verticalAlign: 'center',
});

const OtherItems: FC = () => {
  return (
    <Fragment>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
    </Fragment>
  );
};

const PopupContent: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div id="popup-content" css={sizedContentStyles}>
      <Popup
        isOpen={isOpen}
        placement="right-start"
        onClose={() => setIsOpen(false)}
        content={() => (
          <div id="popup-content-2" css={sizedContentStyles}>
            <div>A second pop-up</div>
            <OtherItems />
          </div>
        )}
        offset={[0, 12]}
        trigger={(triggerProps) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <a
            id="popup-trigger"
            {...triggerProps}
            // @ts-ignore
            ref={triggerProps.ref}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup
          </a>
        )}
      />
      <OtherItems />
    </div>
  );
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div css={spacerStyles}>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={() => <PopupContent />}
        trigger={(triggerProps) => (
          <Button
            id="popup-trigger"
            {...triggerProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup
          </Button>
        )}
        placement={'bottom-start'}
      />
    </div>
  );
};
