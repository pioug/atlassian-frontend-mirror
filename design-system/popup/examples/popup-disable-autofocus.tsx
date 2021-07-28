/** @jsx jsx */
import { FC, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import Popup from '../src';

const spacerStyles = css({
  margin: '250px',
});

const sizedContentStyles = css({
  height: '80px',
  padding: '30px',
  alignItems: 'center',
  overflow: 'auto',
  textAlign: 'center',
  verticalAlign: 'center',
});

const PopupContent: FC = () => {
  return (
    <div id="popup-content" css={sizedContentStyles}>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum fugit aut
      reiciendis fuga praesentium illo rerum, libero, placeat deleniti inventore
      odit incidunt laborum qui nam voluptatum iusto voluptas sapiente magnam?
    </div>
  );
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const input = document.querySelector('input');
    input && input.focus();
  });

  return (
    <div id="container" css={spacerStyles}>
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
        placement="bottom"
        autoFocus={false}
      />
      <input placeholder="This should keep focus" />
    </div>
  );
};
