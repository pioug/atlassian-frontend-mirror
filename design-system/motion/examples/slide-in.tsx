/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { ExitingPersistence, SlideIn } from '../src';
import { Direction, Fade } from '../src/entering/types';

const froms: Direction[] = ['top', 'right', 'bottom', 'left'];
const fades: Fade[] = ['none', 'in', 'out', 'inout'];

export default () => {
  const [isIn, setIsIn] = useState(true);
  const [fromIndex, setFromIndex] = useState(0);
  const [fadeIndex, setFadeIndex] = useState(0);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <ButtonGroup>
          <Button onClick={() => setIsIn((prev) => !prev)}>
            {isIn ? 'Exit' : 'Enter'}
          </Button>
          <Button
            onClick={() => setFromIndex((prev) => (prev + 1) % froms.length)}
          >
            From {froms[fromIndex]}
          </Button>
          <Button
            onClick={() => setFadeIndex((prev) => (prev + 1) % fades.length)}
          >
            Fade {fades[fadeIndex]}
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
          <ExitingPersistence appear>
            {isIn && (
              <SlideIn enterFrom={froms[fromIndex]} fade={fades[fadeIndex]}>
                {(props) => (
                  <Block
                    {...props}
                    css={{
                      height: '95%',
                      width: '95%',
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
