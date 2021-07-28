/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import Popup from '../src';

const noop = () => {};
const data = [
  `Last night I saw you in my dreams, now I can't wait to go to sleep.`,
  `You've got to realize that the world's a test, you can only do your best and let Him do the rest.`,
  `Reality is wrong.`,
  `I've done a lot of work to get where I'm at, but I have to keep working.`,
  `Every day is new.`,
  `Be careful what you say to someone today.`,
];

const quoteStyles = css({
  maxWidth: 300,
  padding: 16,
  textAlign: 'center',
});

const Quotes = ({ onUpdate }: { onUpdate: () => void }) => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % data.length);
      onUpdate();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [onUpdate]);

  return <div css={quoteStyles}>{data[textIndex]}</div>;
};

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdateOn, setIsUpdateOn] = useState(true);

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <ButtonGroup>
        <Popup
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          content={(props) => (
            <Quotes onUpdate={isUpdateOn ? props.update : noop} />
          )}
          trigger={(triggerProps) => (
            <Button
              {...triggerProps}
              isSelected={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              Quotes
            </Button>
          )}
        />
        <Button
          isSelected={isUpdateOn}
          onClick={() => setIsUpdateOn((prev) => !prev)}
        >
          {isUpdateOn ? 'Will schedule update' : 'Will not schedule update'}
        </Button>
      </ButtonGroup>
    </div>
  );
};
