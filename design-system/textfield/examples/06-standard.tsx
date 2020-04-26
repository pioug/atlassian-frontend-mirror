import React from 'react';
import Textfield from '../src';
import { subtleHeading } from '@atlaskit/theme/colors';
import { gridSize, fontSize } from '@atlaskit/theme/constants';
import { headingSizes } from '@atlaskit/theme/typography';

export default function() {
  return (
    <div>
      <label
        htmlFor="basic"
        style={{
          fontSize: `${headingSizes.h200.size / fontSize()}em`,
          fontStyle: 'inherit',
          lineHeight: `${headingSizes.h200.lineHeight /
            headingSizes.h200.size}`,
          color: `${subtleHeading()}`,
          fontWeight: 600,
          marginTop: `${gridSize() * 2}px`,
        }}
      >
        Basic text field
      </label>
      <Textfield name="basic" />
    </div>
  );
}
