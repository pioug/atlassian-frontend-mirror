/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import Button, { ButtonGroup } from '../src';

const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ padding: 8 }} {...props} />
);

export default () => (
  <Row>
    <Row>
      <ButtonGroup appearance="primary">
        <Button>First Button</Button>
        <Button>Second Button</Button>
        <Button>Third Button</Button>
      </ButtonGroup>
    </Row>
  </Row>
);
