import React from 'react';

import { token } from '@atlaskit/tokens';

import { Create } from '../../src';

const onClick = (...args: any[]) => {
  console.log('create click', ...args);
};
const StyledTooltip = () => (
  <span>
    Create
    <span
      style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        color: token('color.background.accent.orange.subtle'),
      }}
    >
      [c]
    </span>
  </span>
);

export const DefaultCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={onClick}
    text="Create"
    testId="create-cta"
  />
);

export const GermanCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={onClick}
    text="Erstellen"
    testId="create-cta"
  />
);

export const SpanishCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={onClick}
    text="Crear"
    testId="create-cta"
  />
);

export const TurkishCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={onClick}
    text="Oluştur"
    testId="create-cta"
  />
);

export const JapaneseCreate = () => (
  <Create
    buttonTooltip={<StyledTooltip />}
    iconButtonTooltip="Create button"
    onClick={onClick}
    text="作成"
    testId="create-cta"
  />
);
