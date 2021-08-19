/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import styled from '@emotion/styled';

import { B500 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { e300 } from '@atlaskit/theme/elevation';

import { Manager, Placement, Popper, Reference } from '../src';

interface PopupProps {
  isReferenceHidden: boolean | undefined;
}

const POPPER_OFFSET = 8;
const POPPER_FLIP_PADDING = 5;

const REF_WIDTH = 80;
const REF_HEIGHT = 40;
const POPUP_HEIGHT = 40;
const SPACING = 35;

const Popup = styled.div`
  background: white;
  border: 2px solid red;
  border-radius: ${borderRadius}px;
  max-width: 110px;
  min-height: ${POPUP_HEIGHT - 20}px;
  padding: 8px;
  text-overflow: 'ellipsis';
  transition: opacity 200ms ease-in-out;
  opacity: ${(p: PopupProps) => (p.isReferenceHidden ? 0 : 1)};
  ${e300};
`;

const ReferenceBox = styled.div`
  background: ${B500};
  padding: 10px;
  border-radius: ${borderRadius}px;
  color: white;
  text-align: center;
  width: ${REF_WIDTH - 20}px;
  height: ${REF_HEIGHT - 20}px;
  text-overflow: 'ellipsis';
`;

const ReferenceBoundaries = styled.div`
  background: lightblue;
  border-radius: ${borderRadius}px;
  padding: ${POPPER_OFFSET}px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
`;

const BasicPopper = ({
  children,
  placement = 'bottom-start',
}: {
  children?: React.ReactNode;
  placement?: Placement;
}) => (
  <ReferenceBoundaries>
    <Manager>
      <Reference>
        {({ ref }) => <ReferenceBox ref={ref}>Reference</ReferenceBox>}
      </Reference>
      <Popper placement={placement}>
        {({ ref, style, placement, isReferenceHidden }) => (
          <Popup
            isReferenceHidden={isReferenceHidden}
            ref={ref}
            style={style}
            data-placement={placement}
          >
            {children || 'Popper'}
          </Popup>
        )}
      </Popper>
    </Manager>
  </ReferenceBoundaries>
);

const Test = () => (
  <>
    <div style={{ display: 'flex' }}>
      <BasicPopper>Popper</BasicPopper>
      <div style={{ marginTop: -REF_HEIGHT, marginLeft: SPACING }}>
        <BasicPopper placement="right">
          Popper shifts along edge of window
        </BasicPopper>
      </div>
      <div
        style={{
          marginTop: -(REF_HEIGHT + POPPER_OFFSET),
          marginLeft: SPACING,
        }}
      >
        <BasicPopper>Not visible when reference is obscured</BasicPopper>
      </div>
      <div
        style={{
          marginTop: REF_HEIGHT + POPPER_OFFSET,
          marginLeft: SPACING,
        }}
      >
        <BasicPopper placement="top">Doesn't flip</BasicPopper>
      </div>
      <div
        style={{
          marginTop: REF_HEIGHT + POPPER_OFFSET - POPPER_FLIP_PADDING,
          marginLeft: SPACING,
        }}
      >
        <BasicPopper placement="top">
          Flips when within 5px of viewport boundary
        </BasicPopper>
      </div>
    </div>
    <div style={{ marginLeft: -REF_WIDTH }}>
      <BasicPopper>Popper shifts along edge of window</BasicPopper>
    </div>
    <div
      style={{ marginTop: SPACING, marginLeft: -(REF_WIDTH + POPPER_OFFSET) }}
    >
      <BasicPopper>Not visible when reference is obscured</BasicPopper>
    </div>
  </>
);

export default () => (
  <div
    style={{
      margin: '0px',
      width: '1000px',
      boxShadow: 'inset 0px 0px 0px 10px lightgrey',
    }}
  >
    <Test />
    <div style={{ padding: 20 }}>
      <h3 style={{ marginTop: SPACING }}> Scroll Container</h3>
    </div>
    <div
      style={{
        border: '1px solid black',
        boxShadow: 'inset 0px 0px 0px 10px lightgrey',
        height: '400px',
        width: '90%',
        marginTop: '20px',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          width: '200%',
          height: '200%',
          boxSizing: 'border-box',
        }}
      >
        <Test />
      </div>
    </div>
  </div>
);
