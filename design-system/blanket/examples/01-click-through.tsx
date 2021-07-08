import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Blanket from '../src';

const BasicExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const showBlanketClick = useCallback(() => {
    setIsBlanketVisible((isBlanketVisible) => !isBlanketVisible);
  }, [setIsBlanketVisible]);
  return (
    <div>
      <Button appearance="default" onClick={showBlanketClick}>
        {!isBlanketVisible ? 'Show Blanket' : 'Hide Blanket'}
      </Button>
      <p>
        Open the blanket with shouldAllowClickThrough enabled & click the
        blanket to dismiss it. With shouldAllowClickThrough enabled,
        onBlanketClicked is not called & elements underneath the blanket can be
        interacted with directly.
      </p>

      <Blanket isTinted={isBlanketVisible} shouldAllowClickThrough />
    </div>
  );
};

export default BasicExample;
