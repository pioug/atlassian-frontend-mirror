import React, { useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';

import Drawer from '../src';

const DrawerDefaultExample = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div style={{ padding: '2rem' }}>
      <Drawer
        label="Default drawer"
        testId="drawer-default"
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
      >
        <Lorem count={10} />
      </Drawer>
      <Button
        testId="drawer-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Open drawer
      </Button>
    </div>
  );
};

export default DrawerDefaultExample;
