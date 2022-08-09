/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import Button, { ButtonGroup } from '../src';

const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ padding: 8 }}>{props.children}</div>
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
