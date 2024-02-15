import React from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import { N50A, N60A } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { Manager, Popper, Reference } from '../src';

interface PopupProps {
  isReferenceHidden: boolean | undefined;
}
const Popup = styled.div`
  background: white;
  border: 2px solid red;
  border-radius: ${borderRadius}px;
  max-width: 160px;
  padding: ${token('space.100', '8px')};
  transition: opacity 200ms ease-in-out;
  opacity: ${(p: PopupProps) => (p.isReferenceHidden ? 0 : 1)};
  box-shadow: ${token(
    'elevation.shadow.overlay',
    `0 8px 16px -4px ${N50A}, 0 0 1px ${N60A}`,
  )};
`;

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
      {({ ref, style, placement, isReferenceHidden }) => (
        <Popup
          isReferenceHidden={isReferenceHidden}
          ref={ref}
          style={style}
          data-placement={placement}
        >
          <h3>New Popper</h3>
          <Lorem count={1} />
        </Popup>
      )}
    </Popper>
  </Manager>
);

export default () => (
  <div
    style={{
      border: '1px solid black',
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
      }}
    >
      <h2>Scroll down halfway, then across to see the popper</h2>
      <Lorem count={10} />
      <h2>Halfway, now scroll right</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BasicPopper />
      </div>
      <Lorem count={10} />
    </div>
  </div>
);
