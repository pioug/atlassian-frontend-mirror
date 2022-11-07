/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Button from '../src';

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table' }}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table-row' }}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table-cell', padding: 4 }}>{props.children}</div>
);

const ButtonSpacing = () => (
  <Table>
    <Row>
      <Cell>
        <Button>Default</Button>
      </Cell>
      <Cell>
        <Button spacing="compact">Compact</Button>
      </Cell>
    </Row>
    <Row>
      <Cell>
        <Button appearance="link">Default</Button>
      </Cell>
      <Cell>
        <Button appearance="link" spacing="compact">
          Compact
        </Button>
      </Cell>
      <Cell>
        <Button appearance="link" spacing="none">
          None
        </Button>
      </Cell>
    </Row>
  </Table>
);

export default ButtonSpacing;
