/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { Placement, placements } from '@atlaskit/popper';

import Popup from '../../../src';

import { placementGridPositions } from './placement-grid-positions';

const contentStyles = css({
  maxWidth: 220,
  padding: 15,
});

const buttonGridStyles = css({
  display: 'grid',
  gap: 10,
  gridTemplate: 'repeat(5, 1fr) / repeat(5, 1fr)',
  justifyItems: 'stretch',
});

const PopupPlacementExample = () => {
  const [openPlacement, setOpenPlacement] = useState<Placement | null>(null);

  return (
    <div css={buttonGridStyles}>
      {placements.map((placement) => {
        const isOpen = openPlacement === placement;

        return (
          <Popup
            placement={placement}
            isOpen={isOpen}
            onClose={() => {
              if (isOpen) {
                setOpenPlacement(null);
              }
            }}
            content={() => (
              <div css={contentStyles}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                aliquam massa ac risus scelerisque, in iaculis magna semper.
                Phasellus sagittis congue elit, non suscipit nulla rhoncus
                vitae.
              </div>
            )}
            trigger={(triggerProps) => (
              <Button
                {...triggerProps}
                css={placementGridPositions[placement]}
                isSelected={isOpen}
                onClick={() => setOpenPlacement(isOpen ? null : placement)}
              >
                {placement}
              </Button>
            )}
          />
        );
      })}
    </div>
  );
};

export default PopupPlacementExample;
