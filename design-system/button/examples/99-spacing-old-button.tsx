/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Button from '../src';
import NewButton from '../src/new-button/variants/default/button';

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table' }}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table-row' }}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table-cell', padding: token('space.050', '4px') }}>
    {props.children}
  </div>
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
    <Row>
      <Cell>
        <NewButton>Default</NewButton>
      </Cell>
      <Cell>
        <NewButton spacing="compact">Compact</NewButton>
      </Cell>
    </Row>
    <Row>
      <Cell>
        <NewButton appearance="link">Default</NewButton>
      </Cell>
      <Cell>
        <NewButton appearance="link" spacing="compact">
          Compact
        </NewButton>
      </Cell>
      <Cell>
        <NewButton appearance="link" spacing="none">
          None
        </NewButton>
      </Cell>
    </Row>
  </Table>
);

export default ButtonSpacing;
