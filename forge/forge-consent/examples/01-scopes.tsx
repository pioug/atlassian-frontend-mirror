import React from 'react';

import { css } from '@emotion/core';

import { Scope } from '../src';

import { scopes } from './00-basic';

export default () => (
  <div
    css={css`
      width: 600px;
    `}
  >
    {scopes.map(scope => (
      <Scope key={scope.id} title={scope.name} id={scope.id}>
        {scope.description}
      </Scope>
    ))}
  </div>
);
