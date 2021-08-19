/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import Button, { ButtonGroup } from '../src';

function Disabled() {
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '> *': { marginBottom: gridSize() },
      }}
    >
      <Button onClick={() => setIsDisabled((value) => !value)}>
        Disabled: {isDisabled ? 'true' : 'false'}
      </Button>
      <div>
        <ButtonGroup>
          <Button isDisabled={isDisabled}>{'<button>'}</Button>
          <Button isDisabled={isDisabled} href="#">
            {'<a>'}
          </Button>
          <Button isDisabled={isDisabled} component="span">
            {'<span>'}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default () => <Disabled />;
