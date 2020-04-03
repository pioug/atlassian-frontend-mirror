import React from 'react';
import Avatar from '../src';
import { Block, Gap } from '../examples-util/helpers';

export default () => (
  <div>
    <Block heading="Circle">
      <Avatar name="xxlarge" size="xxlarge" />
      <Gap />
      <Avatar name="xlarge" size="xlarge" presence="online" />
      <Gap />
      <Avatar name="large" size="large" presence="offline" />
      <Gap />
      <Avatar name="medium" size="medium" presence="busy" />
      <Gap />
      <Avatar name="small" size="small" presence="focus" />
      <Gap />
      <Avatar name="xsmall" size="xsmall" />
    </Block>
    <Block heading="Square">
      <Avatar appearance="square" name="xxlarge" size="xxlarge" />
      <Gap />
      <Avatar
        appearance="square"
        name="xlarge"
        size="xlarge"
        status="approved"
      />
      <Gap />
      <Avatar appearance="square" name="large" size="large" status="declined" />
      <Gap />
      <Avatar appearance="square" name="medium" size="medium" status="locked" />
      <Gap />
      <Avatar appearance="square" name="small" size="small" />
      <Gap />
      <Avatar appearance="square" name="xsmall" size="xsmall" />
    </Block>
  </div>
);
