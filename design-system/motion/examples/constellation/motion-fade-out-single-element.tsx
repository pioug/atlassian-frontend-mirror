/** @jsx jsx */
import { useState } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';

import { Block, Centered, RetryContainer } from '../utils';

const MotionFadeOutSingleElementExample = () => {
  const directions = [
    undefined,
    'top' as const,
    'right' as const,
    'bottom' as const,
    'left' as const,
  ];
  const [direction, setDirection] = useState(0);

  return (
    <RetryContainer>
      <div css={containerStyles}>
        <Button
          onClick={() => {
            setDirection((direction + 1) % directions.length);
          }}
        >
          {directions[direction] !== undefined
            ? `Enter from ${directions[direction]}`
            : 'No Motion'}
        </Button>

        <Centered css={centeredStyles}>
          <ExitingPersistence appear>
            <FadeIn entranceDirection={directions[direction]}>
              {(props) => <Block {...props} />}
            </FadeIn>
          </ExitingPersistence>
        </Centered>
      </div>
    </RetryContainer>
  );
};

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '182px' });

export default MotionFadeOutSingleElementExample;
