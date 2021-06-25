import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Blanket from '../src';

const BasicExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const showBlanketClick = () => {
    setIsBlanketVisible(!isBlanketVisible);
  };
  return (
    <div>
      <Button appearance="default" onClick={showBlanketClick}>
        {!isBlanketVisible ? 'Show Blanket' : 'Hide Blanket'}
      </Button>
      <p>
        Open the blanket with canClickThrough enabled & click the blanket to
        dismiss it. With canClickThrough enabled, onBlanketClicked is not called
        & elements underneath the blanket can be interacted with directly.
      </p>

      <Blanket isTinted={isBlanketVisible} canClickThrough />
    </div>
  );
};

export default BasicExample;
