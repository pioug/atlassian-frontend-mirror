/** @jsx jsx */
import { ReactNode, useState } from 'react';

import { jsx } from '@emotion/core';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';
import { ConfluenceIcon, JiraServiceManagementIcon } from '@atlaskit/logo';

import { Block, Centered, RetryContainer } from '../examples-utils';
import { ExitingPersistence, FadeIn } from '../src';

const EnteringBlock = ({
  children,
  exitThenEnter,
}: {
  children: ReactNode;
  exitThenEnter?: boolean;
}) => (
  <FadeIn>
    {(props, state) => (
      <Block
        css={{
          position:
            state === 'entering' || exitThenEnter ? 'static' : 'absolute',
          left: 0,
          top: 0,
        }}
        {...props}
      >
        {children}
      </Block>
    )}
  </FadeIn>
);

const elements = [
  (exitThenEnter: boolean) => (
    <EnteringBlock exitThenEnter={exitThenEnter}>
      <ConfluenceIcon size="xlarge" />
    </EnteringBlock>
  ),
  (exitThenEnter: boolean) => (
    <EnteringBlock exitThenEnter={exitThenEnter}>
      <JiraServiceManagementIcon size="xlarge" />
    </EnteringBlock>
  ),
];

export default () => {
  const [index, setIndex] = useState(0);
  const [appear, setAppear] = useState(true);
  const [exitThenEnter, setExitThenEnter] = useState(false);

  return (
    <RetryContainer>
      <div css={{ textAlign: 'center' }}>
        <ButtonGroup>
          <Button
            onClick={() => setIndex((prev) => (prev + 1) % elements.length)}
          >
            Switch
          </Button>

          <Button
            isSelected={appear}
            onClick={() => setAppear((appear) => !appear)}
          >
            {appear ? 'Appears on mount' : 'Immediately appear on mount'}
          </Button>

          <Button
            isSelected={exitThenEnter}
            onClick={() => {
              setExitThenEnter((prev) => !prev);
              setTimeout(
                () => setIndex((prev) => (prev + 1) % elements.length),
                1,
              );
            }}
          >
            {exitThenEnter
              ? 'Will exit first then enter'
              : 'Will exit and enter at the same time'}
          </Button>
        </ButtonGroup>

        <Centered>
          <div css={{ position: 'relative' }}>
            <ExitingPersistence appear={appear} exitThenEnter={exitThenEnter}>
              <div key={index}>{elements[index](exitThenEnter)}</div>
            </ExitingPersistence>
          </div>
        </Centered>
      </div>
    </RetryContainer>
  );
};
