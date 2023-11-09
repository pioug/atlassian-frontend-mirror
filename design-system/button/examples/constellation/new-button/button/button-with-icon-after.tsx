import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import { UNSAFE_BUTTON } from '../../../../src';

const ButtonIconAfterExample = () => {
  return (
    <UNSAFE_BUTTON
      iconAfter={<StarFilledIcon label="" size="medium" />}
      appearance="primary"
    >
      Icon after
    </UNSAFE_BUTTON>
  );
};

export default ButtonIconAfterExample;
