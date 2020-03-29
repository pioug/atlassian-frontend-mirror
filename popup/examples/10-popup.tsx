/** @jsx jsx */
import { FC, useState } from 'react';
import Button from '@atlaskit/button';
import { Placement } from '@atlaskit/popper';
import { jsx } from '@emotion/core';

import Popup from '../src';

const spacerCSS = {
  margin: '250px',
};

const sizedContentCSS = {
  alignItems: 'center',
  height: '80px',
  overflow: 'auto',
  padding: '30px',
  textAlign: 'center',
  verticalAlign: 'center',
} as const;

type PopupProps = {
  setPosition(): void;
  placement: string;
};

const PopupContent: FC<PopupProps> = ({ setPosition, placement }) => {
  return (
    <div id="popup-content" css={sizedContentCSS}>
      <Button testId="popup-position" onClick={() => setPosition()}>
        Toggle Position
      </Button>
      <p>
        Current placement: <strong>{placement}</strong>
      </p>
      <hr />
      <p>Scroll down.</p>
      <Button>Button 5</Button>
      <Button>Button 6</Button>
    </div>
  );
};

const placements: Placement[] = [
  'bottom-start',
  'bottom',
  'bottom-end',
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'left-start',
  'left',
  'left-end',
  'auto-start',
  'auto',
  'auto-end',
];

export default () => {
  const [idx, setIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const placement = placements[idx];

  const setPlacement = () => {
    if (idx !== placements.length - 1) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
    }
  };

  return (
    <div css={spacerCSS}>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        content={() => (
          <PopupContent setPosition={setPlacement} placement={placement} />
        )}
        trigger={triggerProps => (
          <Button
            id="popup-trigger"
            {...triggerProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup
          </Button>
        )}
        placement={placement}
      />
    </div>
  );
};
