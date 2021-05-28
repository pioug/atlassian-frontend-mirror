// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import React from 'react';

import { Block, Gap, ShrinkWrap } from '../examples-util/helpers';
import Avatar, { Status } from '../src';

export default () => (
  <div>
    <p>Status</p>
    <Block>
      <ShrinkWrap>
        <Status status="approved" />
      </ShrinkWrap>
      <ShrinkWrap>
        <Status status="declined" />
      </ShrinkWrap>
      <ShrinkWrap>
        <Status status="locked" />
      </ShrinkWrap>
    </Block>

    <p>Circular</p>
    <Block>
      <Avatar name="xxlarge" size="xxlarge" />
      <Gap />
      <Avatar name="xlarge" size="xlarge" status="approved" />
      <Gap />
      <Avatar name="large" size="large" status="declined" />
      <Gap />
      <Avatar name="medium" size="medium" status="locked" />
      <Gap />
      <Avatar name="small" size="small" status="approved" />
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
        status="approved"
      />
      <Gap />
      <Avatar appearance="square" name="large" size="large" status="declined" />
      <Gap />
      <Avatar appearance="square" name="medium" size="medium" status="locked" />
      <Gap />
      <Avatar appearance="square" name="small" size="small" status="approved" />
      <Gap />
      <Avatar appearance="square" name="xsmall" size="xsmall" />
    </Block>
  </div>
);
