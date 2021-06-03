/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button from '@atlaskit/button/standard-button';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { ExitingPersistence, FadeIn } from '../src';

export default () => {
  const directions = [
    undefined,
    'top' as const,
    'right' as const,
    'bottom' as const,
    'left' as const,
  ];
  const [direction, setDirection] = useState(0);
  const [isIn, setIsIn] = useState(true);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <Button onClick={() => setIsIn((prev) => !prev)}>
          {isIn ? 'Exit' : 'Enter'}
        </Button>
        <Button
          onClick={() => {
            setDirection((direction + 1) % directions.length);
          }}
        >
          {directions[direction] !== undefined
            ? `Enter from ${directions[direction]}`
            : 'No Motion'}
        </Button>

        <Centered css={{ height: '182px' }}>
          <ExitingPersistence appear>
            {isIn && (
              <FadeIn entranceDirection={directions[direction]}>
                {(props) => <Block {...props} />}
              </FadeIn>
            )}
          </ExitingPersistence>
        </Centered>
      </div>
    </RetryContainer>
  );
};
