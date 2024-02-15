/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const blanketChildStyles = css({
  width: '50%',
  margin: `${token('space.300', '24px')} auto`,
  padding: token('space.500', '40px'),
  backgroundColor: token('elevation.surface', N0),
});

const BasicExample = () => {
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
      <p>
        Click "Show blanket" button to open the blanket & click the blanket to
        dismiss it.
      </p>
      <Blanket
        onBlanketClicked={onBlanketClicked}
        isTinted={isBlanketVisible}
        shouldAllowClickThrough={shouldAllowClickThrough}
        testId="blanket-with-children"
      >
        <Lorem css={blanketChildStyles} count={20} />
      </Blanket>
    </div>
  );
};

export default BasicExample;
