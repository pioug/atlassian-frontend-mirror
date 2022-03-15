import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';

import Drawer from '../../src';

const DrawerDefaultExample = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Drawer onClose={() => setOpen(false)} isOpen={open}>
        <p>Content</p>
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
    </>
  );
};

export default DrawerDefaultExample;
