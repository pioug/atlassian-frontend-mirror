/** @jsx jsx */
import { FC, useState, useEffect } from 'react';
import Button from '@atlaskit/button';
import { Placement } from '@atlaskit/popper';
import { jsx } from '@emotion/core';

import Popup from '../src';

type PopupProps = {
  loading: boolean;
  setPosition(): void;
  position: string;
  scheduleUpdate?(): void;
  setButtonWidth: any;
  buttonWidth: number;
};

const containerCSS = {
  margin: '250px',
};

const loadingCSS = {
  textAlign: 'center',
  padding: '30px',
} as const;

const contentCSS = {
  alignItems: 'center',
  textAlign: 'center',
  verticalAlign: 'center',
  padding: '30px',
  maxWidth: '300px',
} as const;

const expanderCSS = ({ width }: { width: number }) => ({
  display: 'inline-block',
  width: width ? `${width}px` : 0,
});

const PopupContent: FC<PopupProps> = ({
  loading,
  setPosition,
  position,
  setButtonWidth,
  buttonWidth,
  scheduleUpdate,
}) => {
  const [content, setContent] = useState(
    'Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. ',
  );
  const addContent = () => {
    setContent(`${content}Lorem Ipsum dolor sit amet. `);

    // Reposition the popup
    typeof scheduleUpdate === 'function' && scheduleUpdate();
  };

  const clearContent = () => {
    setContent('');

    // Reposition the popup
    typeof scheduleUpdate === 'function' && scheduleUpdate();
  };

  return loading ? (
    <div id="spinner" css={loadingCSS}>
      Loading...
    </div>
  ) : (
    <div id="popup-content" css={contentCSS}>
      <Button onClick={() => setPosition()}>Toggle Position</Button>
      <p>
        Current position: <strong>{position}</strong>
      </p>
      <hr />
      <Button onClick={() => setButtonWidth(buttonWidth + 15)}>
        Expand Button
      </Button>
      <Button onClick={() => setButtonWidth(0)}>Reset Button</Button>
      <hr />
      <Button onClick={addContent}>Add Content</Button>
      <Button onClick={clearContent}>Clear Content</Button>
      <br />
      {content}
    </div>
  );
};

const positions: Placement[] = [
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
  const [buttonWidth, setButtonWidth] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => setIsLoaded(true), 600);
    } else {
      setIsLoaded(false);
    }
  }, [isOpen]);
  const position = positions[idx];

  const setPosition = () => {
    if (idx !== positions.length - 1) {
      setIdx(idx + 1);
    } else {
      setIdx(0);
    }
  };

  return (
    <div css={containerCSS}>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        offset="0, 20px"
        content={({ scheduleUpdate }) => (
          <PopupContent
            loading={!isLoaded}
            setPosition={setPosition}
            position={position}
            setButtonWidth={setButtonWidth}
            buttonWidth={buttonWidth}
            scheduleUpdate={scheduleUpdate}
          />
        )}
        trigger={triggerProps => (
          <Button
            id="popup-trigger"
            {...triggerProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup{' '}
            <div css={expanderCSS({ width: buttonWidth })} />
          </Button>
        )}
        placement={position}
      />
    </div>
  );
};
