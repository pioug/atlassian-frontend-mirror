import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Blanket from '../../src';

const BlanketClickthroughExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const showBlanketClick = useCallback(() => {
    setIsBlanketVisible((isBlanketVisible) => !isBlanketVisible);
  }, [setIsBlanketVisible]);
  return (
    <div>
      <Button appearance="default" onClick={showBlanketClick}>
        {!isBlanketVisible ? 'Show Blanket' : 'Hide Blanket'}
      </Button>

      <Blanket isTinted={isBlanketVisible} shouldAllowClickThrough />
    </div>
  );
};

export default BlanketClickthroughExample;
