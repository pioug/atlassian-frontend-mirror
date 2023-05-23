import React from 'react';

import { subtleHeading } from '@atlaskit/theme/colors';
import { fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';
import { token } from '@atlaskit/tokens';

import Textfield from '../src';

export default function MaxValueExample() {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label
        htmlFor="max"
        style={{
          fontSize: `${headingSizes.h200.size / fontSize()}em`,
          fontStyle: 'inherit',
          lineHeight: `${
            headingSizes.h200.lineHeight / headingSizes.h200.size
          }`,
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          color: `${subtleHeading()}`,
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
