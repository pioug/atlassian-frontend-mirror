/* eslint-disable @repo/internal/react/use-primitives */
/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import Drawer from '../src';
import { DrawerWidth } from '../src/components/types';
import { widths } from '../src/constants';

const buttonContainerStyles = css({
  display: 'flex',
  gap: token('spacing.scale.200', '1rem'),
});

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
      <div css={buttonContainerStyles}>
        {widths.map((width) => (
          <Button
            onClick={openDrawer(width)}
            type="button"
            key={width}
            id={`open-${width}-drawer`}
          >{`Open ${width} Drawer`}</Button>
        ))}
      </div>
    </div>
  );
};

export default DrawersExample;
