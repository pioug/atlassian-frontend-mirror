/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import styled from '@emotion/styled';
import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/standard-button';
import { borderRadius } from '@atlaskit/theme/constants';
import { e300 } from '@atlaskit/theme/elevation';

import { Manager, Popper, Reference } from '../src';

interface PopupProps {
  isReferenceHidden: boolean | undefined;
}
const Popup = styled.div`
  background: white;
  border: 2px solid red;
  border-radius: ${borderRadius}px;
  max-width: 160px;
  padding: 8px;
  transition: opacity 200ms ease-in-out;
  opacity: ${(p: PopupProps) => (p.isReferenceHidden ? 0 : 1)};
  ${e300};
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
      marginTop: '20px',
      overflow: 'auto',
    }}
  >
    <div
      style={{
        width: '300%',
        height: '250%',
        boxSizing: 'border-box',
        padding: '16px',
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
      <b>Scroll across and down ↘️ to see the popper</b>
      <br />
      <br />
      <Lorem count={10} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BasicPopper />
      </div>
      <Lorem count={10} />
    </div>
  </div>
);
