import React, { useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';

import Button from '../src/button';

function Overlay() {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  return (
    <>
      <Checkbox
        label="Show overlay"
        onChange={() => setShowOverlay((value) => !value)}
        name="show-loading"
      />
      <Button
        overlay={
          showOverlay ? (
            <span role="img" aria-label="Crazy face Emoji">
              🤪
            </span>
          ) : null
        }
      >
        Hello
      </Button>
    </>
  );
}

export default () => <Overlay />;
