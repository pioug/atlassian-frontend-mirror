/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { subtleHeading } from '@atlaskit/theme/colors';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';

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
          color: `${subtleHeading()}`,
          fontWeight: 600,
          marginTop: `${gridSize() * 2}px`,
        }}
      >
        Basic text field
      </label>
      <Textfield name="basic" id="basic" />
    </div>
  );
}
