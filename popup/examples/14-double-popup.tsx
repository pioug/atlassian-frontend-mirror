/** @jsx jsx */
import { FC, useState, Fragment } from 'react';
import Button from '@atlaskit/button';
import { Placement } from '@atlaskit/popper';
import { jsx } from '@emotion/core';

import Popup from '../src';

const spacerCSS = {
  margin: '250px',
};

const sizedContentCSS = {
  alignItems: 'center',
  padding: '10px',
  textAlign: 'center',
  verticalAlign: 'center',
} as const;

type PopupProps = {
  setPosition(): void;
  placement: string;
};

const OtherItems: FC = () => {
  return (
    <Fragment>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
    </Fragment>
  );
};

const PopupContent: FC<PopupProps> = ({ placement }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div id="popup-content" css={sizedContentCSS}>
      <Popup
        isOpen={isOpen}
        placement="right-start"
        onClose={() => setIsOpen(false)}
        content={() => (
          <div id="popup-content-2" css={sizedContentCSS}>
            <div>A second pop-up</div>
            <OtherItems />
          </div>
        )}
        offset="0, 12px"
        trigger={triggerProps => (
          <a
            id="popup-trigger"
            {...triggerProps}
            // @ts-ignore
            ref={triggerProps.ref}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup
          </a>
        )}
      />
      <OtherItems />
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
