/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import Button, { ButtonGroup } from '@atlaskit/button';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { ExitingPersistence, SlideIn } from '../src';
import { Direction } from '../src/entering/types';

const froms: Direction[] = ['top', 'right', 'bottom', 'left'];

export default () => {
  const [isIn, setIsIn] = useState(true);
  const [fromIndex, setFromIndex] = useState(0);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <ButtonGroup>
          <Button onClick={() => setIsIn(prev => !prev)}>
            {isIn ? 'Exit' : 'Enter'}
          </Button>
          <Button
            onClick={() => setFromIndex(prev => (prev + 1) % froms.length)}
          >
            From {froms[fromIndex]}
          </Button>
        </ButtonGroup>

        <Centered
          css={{
            overflow: 'hidden',
            height: '300px',
            margin: '0 auto',
            position: 'relative',
          }}
        >
          <ExitingPersistence>
            {isIn && (
              <SlideIn enterFrom={froms[fromIndex]}>
                {props => (
                  <Block
                    {...props}
                    css={{
                      height: '95%',
                      width: '95%',
                      position: 'absolute',
                      margin: 'auto',
                    }}
                  />
                )}
              </SlideIn>
            )}
          </ExitingPersistence>
        </Centered>
      </div>
    </RetryContainer>
  );
};
