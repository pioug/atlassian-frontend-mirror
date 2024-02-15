import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';

import Drawer from '../../src';

const DrawerDefaultExample = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Drawer
        label="Default drawer"
        onClose={() => setOpen(false)}
        isOpen={open}
      >
        <Lorem count={10} />
      </Drawer>
      <Button appearance="primary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
    </>
  );
};

export default DrawerDefaultExample;
