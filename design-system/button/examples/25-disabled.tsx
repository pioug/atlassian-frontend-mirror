/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { gridSize } from '@atlaskit/theme';

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
      <Button onClick={() => setIsDisabled(value => !value)}>
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
