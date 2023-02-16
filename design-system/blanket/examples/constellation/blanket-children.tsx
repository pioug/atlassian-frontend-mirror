/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Blanket from '../../src';

const blanketChildStyles = css({
  width: '50%',
  margin: token('space.600', '48px'),
  paddingTop: token('space.300', '24px'),
  paddingBottom: token('space.300', '24px'),
  backgroundColor: token('elevation.surface', N0),
});

const BlanketWithChildrenExample = () => {
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
        testId="blanket-with-children"
      >
        <div css={blanketChildStyles}>
          Click "Show blanket" button to open the blanket & click the blanket to
          dismiss it.
        </div>
      </Blanket>
    </div>
  );
};

export default BlanketWithChildrenExample;
