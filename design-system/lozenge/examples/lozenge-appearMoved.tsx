/** @jsx jsx */
import { ReactNode } from 'react';

import { jsx } from '@emotion/core';

import Lozenge, { ThemeAppearance } from '../src';

const Row: React.FunctionComponent<ReactNode> = ({ children }) => (
  <div css={{ display: 'flex' }}>{children}</div>
);

const Col: React.FunctionComponent<ReactNode> = ({ children }) => (
  <div css={{ flex: '1 1 auto' }}>{children}</div>
);

const APPEARANCES: { label: string; value: ThemeAppearance }[] = [
  { label: 'Moved', value: 'moved' },
];

export default () => (
  <div>
    <Row>
      <Col>
        <p>Subtle</p>
        {APPEARANCES.map(a => (
          <p key={a.value as string}>
            <Lozenge appearance={a.value}>{a.label}</Lozenge>
          </p>
        ))}
      </Col>
      <Col>
        <p>Bold</p>
        {APPEARANCES.map(a => (
          <p key={a.value as string}>
            <Lozenge appearance={a.value} isBold>
              {a.label}
            </Lozenge>
          </p>
        ))}
      </Col>
    </Row>
  </div>
);
