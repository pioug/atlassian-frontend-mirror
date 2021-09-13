import React from 'react';

import Button from '@atlaskit/button/standard-button';
import { Placement } from '@atlaskit/popper';

import InlineDialog from '../src';

import StackLayout from './utils/stack-layout';

const PLACEMENT_POSITIONS: Array<Placement> = [
  'bottom-end',
  'bottom',
  'bottom-start',
  'auto-start',
  'auto',
  'auto-end',
  'top-start',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'left-end',
  'left',
  'left-start',
  'top',
];

const styles: React.CSSProperties = {
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

const InlineDialogPlacementExample = () => {
  return (
    <StackLayout
      size="LARGEST"
      direction="VERTICAL"
      testId={'popper-stack-layout'}
    >
      {PLACEMENT_POSITIONS.map((position) => {
        return (
          <div data-testid="inline-dialog" style={styles}>
            <InlineDialog
              content={
                <div>
                  <p>Placement: {position}</p>
                </div>
              }
              isOpen
              placement={position}
            >
              <Button appearance="primary">Click me!</Button>
            </InlineDialog>
          </div>
        );
      })}
    </StackLayout>
  );
};

export default InlineDialogPlacementExample;
