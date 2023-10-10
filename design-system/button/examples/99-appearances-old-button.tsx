/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React, { useState } from 'react';

import { jsx } from '@emotion/react';

import { Checkbox } from '@atlaskit/checkbox';
import { token } from '@atlaskit/tokens';

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
  <div css={{ display: 'table' }}>{props.children}</div>
);
const Row = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ display: 'flex', flexWrap: 'wrap' }}>{props.children}</div>
);
const Cell = (props: React.HTMLProps<HTMLDivElement>) => (
  <div css={{ width: '100px', padding: `${token('space.050', '4px')} 0` }}>
    {props.children}
  </div>
);

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Example() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div aria-live="polite">
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
    </div>
  );
}
