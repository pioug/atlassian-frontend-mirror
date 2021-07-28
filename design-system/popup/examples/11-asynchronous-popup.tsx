/** @jsx jsx */
import { FC, useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';
import { Placement } from '@atlaskit/popper';

import Popup from '../src';

type PopupProps = {
  loading: boolean;
  setPosition(): void;
  position: string;
  update?(): void;
  setButtonWidth: any;
  buttonWidth: number;
};

const containerStyles = css({
  margin: '250px',
});

const loadingStyles = css({
  padding: '30px',
  textAlign: 'center',
});

const contentStyles = css({
  maxWidth: '300px',
  padding: '30px',
  alignItems: 'center',
  textAlign: 'center',
  verticalAlign: 'center',
});

const expanderStyles = css({
  display: 'inline-block',
});

const PopupContent: FC<PopupProps> = ({
  loading,
  setPosition,
  position,
  setButtonWidth,
  buttonWidth,
  update,
}) => {
  const [content, setContent] = useState(
    'Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. Lorem Ipsum dolor sit amet. ',
  );
  const addContent = () => {
    setContent(`${content}Lorem Ipsum dolor sit amet. `);

    // Reposition the popup
    typeof update === 'function' && update();
  };

  const clearContent = () => {
    setContent('');

    // Reposition the popup
    typeof update === 'function' && update();
  };

  return loading ? (
    <div id="spinner" css={loadingStyles}>
      Loading...
    </div>
  ) : (
    <div id="popup-content" css={contentStyles}>
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
    <div css={containerStyles}>
      <Popup
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        offset={[0, 20]}
        content={({ update }) => (
          <PopupContent
            loading={!isLoaded}
            setPosition={setPosition}
            position={position}
            setButtonWidth={setButtonWidth}
            buttonWidth={buttonWidth}
            update={update}
          />
        )}
        trigger={(triggerProps) => (
          <Button
            id="popup-trigger"
            {...triggerProps}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Open'} Popup{' '}
            <div
              style={{ width: buttonWidth ? `${buttonWidth}px` : 0 }}
              css={expanderStyles}
            />
          </Button>
        )}
        placement={position}
      />
    </div>
  );
};
