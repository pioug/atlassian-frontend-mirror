/** @jsx jsx */
import { useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import Blanket from '../src';

const eventResultStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  margin: '0.5em',
  // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
  padding: '0.5em',
  borderColor: token('color.border', '#ccc'),
  borderStyle: 'dashed',
  borderWidth: token('border.width', '1px'),
  color: token('color.text.subtlest', '#ccc'),
});

const BasicExample = () => {
  const [isBlanketVisible, setIsBlanketVisible] = useState(false);
  const [shouldAllowClickThrough, setShouldAllowClickThrough] = useState(true);
  const [onEventResult, setOnEventResult] = useState(
    'Blanket isTinted:false shouldAllowClickThrough:true',
  );

  const showBlanketClick = useCallback(() => {
    setOnEventResult('Blanket isTinted: true shouldAllowClickThrough: false');
    setIsBlanketVisible(true);
    setShouldAllowClickThrough(false);
  }, []);

  const onBlanketClicked = useCallback(() => {
    setOnEventResult(
      'onBlanketClicked called with shouldAllowClickThrough: true',
    );
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
        testId="basic-blanket"
      />
      <div css={eventResultStyles}>{onEventResult}</div>
    </div>
  );
};

export default BasicExample;
