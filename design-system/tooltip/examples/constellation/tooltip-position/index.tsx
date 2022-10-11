/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { placements } from '@atlaskit/popper';

import Tooltip from '../../../src';

import { placementGridPositions } from './placement-grid-positions';

const buttonGridStyles = css({
  display: 'grid',
  gap: 10,
  gridTemplate: 'repeat(5, 1fr) / repeat(5, 1fr)',
  justifyItems: 'stretch',
});

const buttonStyles = css({
  width: '100%',
});

const PositionExample = () => {
  return (
    <div css={buttonGridStyles}>
      {placements.map((placement) => (
        <div key={placement} css={placementGridPositions[placement]}>
          <Tooltip position={placement} content={placement}>
            <Button css={buttonStyles}>{placement}</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default PositionExample;
