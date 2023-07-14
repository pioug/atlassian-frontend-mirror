import React from 'react';

import { N200 } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import Textfield from '../src';

export default function MaxValueExample() {
  return (
    <div>
      <label
        htmlFor="max"
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
        Max length of 5
      </label>
      <Textfield name="max" maxLength={5} id="max" />
    </div>
  );
}
