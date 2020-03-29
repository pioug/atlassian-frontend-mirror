import React from 'react';
import { colors } from '@atlaskit/theme';

import { Skeleton } from '../src';

export default () => (
  <div>
    <p>Basic icons of different sizes</p>
    <Skeleton size="small" />
    <Skeleton size="medium" />
    <Skeleton size="large" />
    <Skeleton size="xlarge" />

    <p>Changing color via inheritance</p>
    <div style={{ color: colors.P500 }}>
      <Skeleton size="small" />
      <Skeleton size="medium" />
      <Skeleton size="large" />
      <Skeleton size="xlarge" />
    </div>

    <p>Changing color via props</p>
    <Skeleton color={colors.G500} size="small" />
    <Skeleton color={colors.B300} size="medium" />
    <Skeleton color={colors.R500} size="large" />
    <Skeleton color={colors.N200} size="xlarge" />

    <p>With a strong weight</p>
    <Skeleton weight="strong" color={colors.R500} size="small" />
    <Skeleton weight="strong" color={colors.Y300} size="medium" />
    <Skeleton weight="strong" color={colors.B500} size="large" />
    <Skeleton weight="strong" size="xlarge" />
  </div>
);
