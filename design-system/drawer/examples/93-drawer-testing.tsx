import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import Portal from '@atlaskit/portal';

import DrawerPrimitive from '../src/components/primitives';

const DrawerExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  const showDrawer = useCallback(() => setIsOpen(true), []);
  const hideDrawer = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <style>{`body {background: lightgrey}`}</style>
      <Button onClick={showDrawer} testId="show-button">
        Show drawer
      </Button>
      <Portal zIndex="unset">
        <DrawerPrimitive
          testId="drawer"
          in={isOpen}
          onClose={hideDrawer}
          label="Testing drawer primitive"
        />
      </Portal>
    </>
  );
};

export default DrawerExample;
