import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box } from '@atlaskit/primitives';

import Blanket from '../../src';

const BlanketClickthroughExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const showBlanketClick = useCallback(() => {
    setIsBlanketVisible((isBlanketVisible) => !isBlanketVisible);
  }, [setIsBlanketVisible]);
  return (
    <Box>
      <Button appearance="default" onClick={showBlanketClick}>
        {!isBlanketVisible ? 'Show blanket' : 'Hide blanket'}
      </Button>

      <Blanket isTinted={isBlanketVisible} shouldAllowClickThrough />
    </Box>
  );
};

export default BlanketClickthroughExample;
