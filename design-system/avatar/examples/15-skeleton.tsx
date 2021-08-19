/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import * as colors from '@atlaskit/theme/colors';

import { Block, Gap } from '../examples-util/helpers';
import { Skeleton } from '../src';

export default () => (
  <div>
    <Block heading="Circle" testId="example-block">
      <Skeleton size="xxlarge" />
      <Gap />
      <Skeleton size="xlarge" />
      <Gap />
      <Skeleton size="large" />
      <Gap />
      <Skeleton size="medium" />
      <Gap />
      <Skeleton size="small" />
      <Gap />
      <Skeleton size="xsmall" />
    </Block>
    <Block heading="Square" testId="example-block">
      <Skeleton appearance="square" size="xxlarge" />
      <Gap />
      <Skeleton appearance="square" size="xlarge" />
      <Gap />
      <Skeleton appearance="square" size="large" />
      <Gap />
      <Skeleton appearance="square" size="medium" />
      <Gap />
      <Skeleton appearance="square" size="small" />
      <Gap />
      <Skeleton appearance="square" size="xsmall" />
    </Block>
    <Block heading="Coloured via inheritance" testId="example-block">
      <div style={{ color: colors.P500 }}>
        <Skeleton size="xxlarge" />
        <Gap />
        <Skeleton size="xlarge" />
        <Gap />
        <Skeleton size="large" />
        <Gap />
        <Skeleton size="medium" />
        <Gap />
        <Skeleton size="small" />
        <Gap />
        <Skeleton size="xsmall" />
      </div>
    </Block>
    <Block heading="Coloured using props" testId="example-block">
      <Skeleton size="xxlarge" color={colors.Y500} />
      <Gap />
      <Skeleton size="xlarge" color={colors.G500} />
      <Gap />
      <Skeleton size="large" color={colors.B300} />
      <Gap />
      <Skeleton size="medium" color={colors.R500} />
      <Gap />
      <Skeleton size="small" color={colors.N200} />
      <Gap />
      <Skeleton size="xsmall" color={colors.T500} />
    </Block>
    <Block heading="With a strong weight" testId="example-block">
      <Skeleton size="xxlarge" color={colors.Y500} weight="strong" />
      <Gap />
      <Skeleton size="xlarge" color={colors.G500} weight="strong" />
      <Gap />
      <Skeleton size="large" color={colors.B300} weight="strong" />
      <Gap />
      <Skeleton size="medium" color={colors.R500} weight="strong" />
      <Gap />
      <Skeleton size="small" color={colors.N200} weight="strong" />
      <Gap />
      <Skeleton size="xsmall" color={colors.T500} weight="strong" />
    </Block>
  </div>
);
