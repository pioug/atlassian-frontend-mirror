// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { Block, Gap, ShrinkWrap } from '../examples-util/helpers';
import Avatar, { Presence } from '../src';

export default () => (
  <div>
    <p>Presence</p>
    <Block>
      <ShrinkWrap>
        <Presence presence="online" />
      </ShrinkWrap>
      <ShrinkWrap>
        <Presence presence="busy" />
      </ShrinkWrap>
      <ShrinkWrap>
        <Presence presence="focus" />
      </ShrinkWrap>
      <ShrinkWrap>
        <Presence presence="offline" />
      </ShrinkWrap>
    </Block>

    <p>Circular</p>
    <Block>
      <Avatar name="xxlarge" size="xxlarge" />
      <Gap />
      <Avatar name="xlarge" size="xlarge" presence="online" />
      <Gap />
      <Avatar name="large" size="large" presence="busy" />
      <Gap />
      <Avatar name="medium" size="medium" presence="focus" />
      <Gap />
      <Avatar name="small" size="small" presence="offline" />
      <Gap />
      <Avatar name="xsmall" size="xsmall" />
    </Block>

    <p>Square</p>
    <Block>
      <Avatar appearance="square" name="xxlarge" size="xxlarge" />
      <Gap />
      <Avatar
        appearance="square"
        name="xlarge"
        size="xlarge"
        presence="online"
      />
      <Gap />
      <Avatar appearance="square" name="large" size="large" presence="busy" />
      <Gap />
      <Avatar
        appearance="square"
        name="medium"
        size="medium"
        presence="focus"
      />
      <Gap />
      <Avatar
        appearance="square"
        name="small"
        size="small"
        presence="offline"
      />
      <Gap />
      <Avatar appearance="square" name="xsmall" size="xsmall" />
    </Block>
  </div>
);
