/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import AudioIcon from '@atlaskit/icon/glyph/audio';

import Button, { ButtonGroup } from '../src';

const Row = (props: { children: React.ReactNode }) => (
  <div css={{ padding: 8 }}>{props.children}</div>
);
const ConstrainedRow = (props: { children: React.ReactNode }) => (
  <div css={{ padding: 8, width: 180, overflowX: 'scroll' }}>
    {props.children}
  </div>
);

const CustomComponent = (props: { label?: string }) => {
  const { label } = props;

  if (!label) {
    return null;
  }

  return <Button>{label}</Button>;
};

export default () => (
  <Row>
    <Row>
      <ButtonGroup appearance="primary">
        <Button>First Button</Button>
        <Button>Second Button</Button>
        <Button>Third Button</Button>
      </ButtonGroup>
    </Row>
    <Row>
      <ButtonGroup>
        <Button>First Button</Button>
        <CustomComponent label="Hello!" />
        <Button>Second Button</Button>
        <CustomComponent />
        <Button>Third Button</Button>
      </ButtonGroup>
    </Row>
    <ConstrainedRow>
      <ButtonGroup>
        <Button>Good times</Button>
        <Button iconAfter={<AudioIcon label="" />}>Boogie</Button>
        <Button iconAfter={<AudioIcon label="" />} />
      </ButtonGroup>
    </ConstrainedRow>
  </Row>
);
