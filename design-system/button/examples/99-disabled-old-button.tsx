/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Button, { ButtonGroup } from '../src';

function Disabled() {
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '> *': { marginBottom: token('space.100', '8px') },
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
