/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import AudioIcon from '@atlaskit/icon/glyph/audio';
import { token } from '@atlaskit/tokens';

import Button, { ButtonGroup } from '../src';

const Row = (props: { children: React.ReactNode }) => (
  <div css={{ padding: token('space.100', '8px') }}>{props.children}</div>
);
const ConstrainedRow = (props: { children: React.ReactNode }) => (
  <div
    css={{
      padding: token('space.100', '8px'),
      width: 180,
      overflowX: 'scroll',
    }}
  >
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
        <Button iconAfter={<AudioIcon label="Boogie more" />} />
      </ButtonGroup>
    </ConstrainedRow>
  </Row>
);
