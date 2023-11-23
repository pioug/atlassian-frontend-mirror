import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import { UNSAFE_BUTTON } from '../../../../src';

const ButtonIconBeforeExample = () => {
  return (
    <UNSAFE_BUTTON iconBefore={StarFilledIcon} appearance="primary">
      Icon before
    </UNSAFE_BUTTON>
  );
};

export default ButtonIconBeforeExample;
