/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import { gridSize } from '@atlaskit/theme/constants';

import Button, { ButtonGroup } from '../src';

function Overlay() {
  const [overlay, setOverlay] = useState<Boolean>(false);

  const overlayElement = (
    <span role="img" aria-label="Crazy face Emoji">
      🤪
    </span>
  );

  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        '> *': { marginBottom: gridSize() },
      }}
    >
      <Button onClick={() => setOverlay((value) => !value)}>
        Use overlay: {overlay ? 'true' : 'false'}
      </Button>
      <div>
        <ButtonGroup>
          <Button overlay={overlay ? overlayElement : undefined}>
            {'<button>'}
          </Button>
          <Button overlay={overlay ? overlayElement : undefined} href="#">
            {'<a>'}
          </Button>
          <Button
            overlay={overlay ? overlayElement : undefined}
            component="span"
          >
            {'<span>'}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default () => <Overlay />;
