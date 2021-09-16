/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import Drawer from '../src';
import { DrawerWidth } from '../src/components/types';
import { widths } from '../src/constants';

const DrawersExample = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [width, setWidth] = useState<DrawerWidth>('narrow');

  const openDrawer = (updatedWidth: DrawerWidth) => () => {
    setIsDrawerOpen(true);
    setWidth(updatedWidth);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Drawer
        testId="widths"
        onClose={closeDrawer}
        isOpen={isDrawerOpen}
        width={width}
      >
        <code
          style={{
            textTransform: 'capitalize',
          }}
        >{`${width} drawer contents`}</code>
      </Drawer>
      {widths.map((width) => (
        <Button
          onClick={openDrawer(width)}
          type="button"
          key={width}
          id={`open-${width}-drawer`}
          style={{
            marginRight: '1rem',
          }}
        >{`Open ${width} Drawer`}</Button>
      ))}
    </div>
  );
};

export default DrawersExample;
