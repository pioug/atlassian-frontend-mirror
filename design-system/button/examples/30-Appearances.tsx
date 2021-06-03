/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/core';

import { Checkbox } from '@atlaskit/checkbox';

import { Appearance, LoadingButton as Button } from '../src';

const appearances: Appearance[] = [
  'default',
  'primary',
  'link',
  'subtle',
  'subtle-link',
  'warning',
  'danger',
];

const Table = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'table' }} {...props} />
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'flex', flexWrap: 'wrap' }} {...props} />
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ width: '100px', padding: '4px 0' }} {...props} />
);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Example() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <React.Fragment>
      <Checkbox
        label="Show Loading State"
        isChecked={isLoading}
        onChange={() => setIsLoading((value) => !value)}
      />
      <Table>
        {appearances.map((a) => (
          <Row key={a}>
            <Cell>
              <Button isLoading={isLoading} appearance={a}>
                {capitalize(a)}
              </Button>
            </Cell>
            <Cell>
              <Button isLoading={isLoading} appearance={a} isDisabled={true}>
                Disabled
              </Button>
            </Cell>
            <Cell>
              <Button isLoading={isLoading} appearance={a} isSelected={true}>
                Selected
              </Button>
            </Cell>
          </Row>
        ))}
      </Table>
    </React.Fragment>
  );
}
