/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import { gridSize } from '@atlaskit/theme/constants';

import Button, { ButtonGroup } from '../src';

function Overlay() {
  const [overlay, setOverlay] = useState<string | undefined>(undefined);
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '> *': { marginBottom: gridSize() },
      }}
    >
      <Button onClick={() => setOverlay((value) => (value ? undefined : '🤩'))}>
        Use overlay: {overlay ? 'true' : 'false'}
      </Button>
      <div>
        <ButtonGroup>
          <Button overlay={overlay}>{'<button>'}</Button>
          <Button overlay={overlay} href="#">
            {'<a>'}
          </Button>
          <Button overlay={overlay} component="span">
            {'<span>'}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default () => <Overlay />;
