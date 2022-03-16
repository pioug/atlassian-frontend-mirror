/** @jsx jsx */
import { useCallback, useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import Blanket from '../../src';

const BlanketBasicExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);

  const showBlanketClick = useCallback(() => {
    setIsBlanketVisible(true);
    setShouldAllowClickThrough(false);
  }, []);

  const onBlanketClicked = useCallback(() => {
    setIsBlanketVisible(false);
    setShouldAllowClickThrough(true);
  }, []);

  return (
    <div>
      <Button
        appearance="default"
        onClick={showBlanketClick}
        testId="show-button"
      >
        Show blanket
      </Button>
      <Blanket
        onBlanketClicked={onBlanketClicked}
        isTinted={isBlanketVisible}
        shouldAllowClickThrough={shouldAllowClickThrough}
        testId="basic-blanket"
      />
    </div>
  );
};

export default BlanketBasicExample;
