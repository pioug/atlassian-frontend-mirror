/** @jsx jsx */
import { jsx } from '@emotion/core';

import Lozenge, { ThemeAppearance } from '../src';

const APPEARANCES: { label: string; value: ThemeAppearance }[] = [
  { label: 'Default', value: 'default' },
];

export default () => (
  <div>
    {APPEARANCES.map(a => (
      <p key={a.value as string}>
        <Lozenge appearance={a.value} isBold>
          {a.label}
        </Lozenge>
      </p>
    ))}
  </div>
);
