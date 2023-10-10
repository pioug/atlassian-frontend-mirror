/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

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

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'svg, span': {
    animationDuration: '0s',
    animationTimingFunction: 'step-end',
  },
});

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
  return (
    <div css={animationStyles}>
      <Table>
        {appearances.map((a) => (
          <Row key={a}>
            <Cell>
              <Button isLoading={true} appearance={a}>
                {capitalize(a)}
              </Button>
            </Cell>
            <Cell>
              <Button isLoading={true} appearance={a} isDisabled={true}>
                Disabled
              </Button>
            </Cell>
            <Cell>
              <Button isLoading={true} appearance={a} isSelected={true}>
                Selected
              </Button>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}
