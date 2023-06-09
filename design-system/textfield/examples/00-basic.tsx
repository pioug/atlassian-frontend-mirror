import React from 'react';

import { N200 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import Textfield from '../src';

export default function BasicExample() {
  return (
    <div>
      <label
        htmlFor="basic"
        style={{
          fontSize: `${headingSizes.h200.size / fontSize()}em`,
          fontStyle: 'inherit',
          lineHeight: `${
            headingSizes.h200.lineHeight / headingSizes.h200.size
          }`,
          color: token('color.text.subtlest', N200),
          fontWeight: 600,
          marginTop: token('space.200', '16px'),
        }}
      >
        Basic text field
      </label>
      <Textfield name="basic" id="basic" />
    </div>
  );
}
