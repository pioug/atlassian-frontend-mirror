/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { token } from '@atlaskit/tokens';

import { Manager, Popper, Reference } from '../../src';

const popupStyles = css({
  maxWidth: '160px',
  padding: token('space.100', '8px'),
  background: token('elevation.surface.overlay'),
  borderRadius: token('border.radius', '3px'),
  boxShadow: token('elevation.shadow.raised'),
});

const popupHiddenStyles = css({
  pointerEvents: 'none',
  visibility: 'hidden',
});

const BasicPopper = () => (
  <Manager>
    <Reference>
      {({ ref }) => (
        <Button appearance="primary" ref={ref}>
          Reference element
        </Button>
      )}
    </Reference>
    <Popper>
      {({ ref, placement, isReferenceHidden, style }) => (
        <div
          ref={ref}
          data-placement={placement}
          style={style}
          css={[popupStyles, isReferenceHidden && popupHiddenStyles]}
        >
          <h3>New Popper</h3>
          <Lorem count={1} />
        </div>
      )}
    </Popper>
  </Manager>
);

const ScrollContainerExample = () => (
  <div
    style={{
      border: `1px solid ${token('color.border.bold')}`,
      maxHeight: '400px',
      maxWidth: '800px',
      marginTop: token('space.250', '20px'),
      overflow: 'auto',
    }}
  >
    <div
      style={{
        width: '300%',
        height: '250%',
        boxSizing: 'border-box',
        padding: token('space.200', '16px'),
        background: token('elevation.surface'),
      }}
    >
      <b style={{ display: 'block', marginBottom: token('space.400', '2rem') }}>
        Scroll to the middle of this container to see the popper <span>↘</span>
      </b>
      <Lorem count={10} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BasicPopper />
      </div>
      <Lorem count={10} />
    </div>
  </div>
);

export default ScrollContainerExample;
