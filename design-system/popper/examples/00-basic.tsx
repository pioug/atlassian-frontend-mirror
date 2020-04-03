import React from 'react';
import Button from '@atlaskit/button';
import Lorem from 'react-lorem-component';
import styled from 'styled-components';
import { elevation, borderRadius } from '@atlaskit/theme';

import { Manager, Reference, Popper } from '../src';

interface PopupProps {
  outOfBoundaries: boolean | null;
}
const Popup = styled.div`
  background: white;
  border: 2px solid red;
  border-radius: ${borderRadius}px;
  max-width: 160px;
  padding: 8px;
  margin: 2px 0;
  transition: opacity 200ms ease-in-out;
  opacity: ${(p: PopupProps) => (p.outOfBoundaries ? 0 : 1)};
  ${elevation.e300};
`;

export default () => (
  <div
    style={{
      border: '1px solid black',
      height: '90vh',
      width: '50vw',
      overflow: 'auto',
    }}
  >
    <div style={{ width: '200%', boxSizing: 'border-box', padding: '16px' }}>
      <Lorem count={6} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <Button appearance="primary" consumerRef={ref}>
                Reference element
              </Button>
            )}
          </Reference>
          <Popper>
            {({ ref, style, placement, outOfBoundaries }) => (
              <Popup
                outOfBoundaries={outOfBoundaries}
                // innerRef can't be null so shortcircuit to undefined if it is.
                innerRef={ref || undefined}
                style={style}
                data-placement={placement}
              >
                <Lorem count={1} />
              </Popup>
            )}
          </Popper>
        </Manager>
      </div>
      <Lorem count={20} />
    </div>
  </div>
);
