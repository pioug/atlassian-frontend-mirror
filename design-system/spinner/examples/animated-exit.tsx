/** @jsx jsx */
import React, { useEffect, useState } from 'react';

import { css, jsx } from '@emotion/core';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import { gridSize } from '@atlaskit/theme/constants';

import Spinner from '../src';

type Phase = 'stopped' | 'loading' | 'ready';

const grid: number = gridSize();

function Harness({
  children,
  title,
}: {
  children: (phase: Phase) => React.ReactElement;
  title: string;
}) {
  const [phase, setPhase] = useState<Phase>('stopped');

  useEffect(
    function onPhaseChange() {
      if (phase === 'loading') {
        const id = window.setTimeout(() => setPhase('ready'), 2000);
        return () => window.clearTimeout(id);
      }
    },
    [phase],
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <h4
        css={css`
          margin-bottom: ${grid * 2}px;
        `}
      >
        {title}
      </h4>
      <Button
        onClick={() => setPhase('loading')}
        isDisabled={phase === 'loading'}
      >
        {phase === 'loading' ? 'running' : 'start'}
      </Button>
      <div
        css={css`
          width: 200px;
          height: 200px;

          /* center align content */
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        {children(phase)}
      </div>
    </div>
  );
}

function NotAnimated() {
  return (
    <Harness title="No exit animation">
      {(phase: Phase) => (
        <React.Fragment>
          {phase === 'ready' && <Avatar size="xlarge" />}
          {phase === 'loading' && (
            <span
              css={css`
                position: absolute;
              `}
            >
              <Spinner size="xlarge" />
            </span>
          )}
        </React.Fragment>
      )}
    </Harness>
  );
}

function Animated() {
  return (
    <Harness title="With cross fading">
      {(phase: Phase) => (
        <React.Fragment>
          <ExitingPersistence appear>
            {phase === 'ready' && (
              <FadeIn>
                {(props) => (
                  <span {...props}>
                    <Avatar size="xlarge" />
                  </span>
                )}
              </FadeIn>
            )}
          </ExitingPersistence>
          <ExitingPersistence>
            {phase === 'loading' && (
              <FadeIn
                onFinish={(value) => console.log('fade in finished', value)}
              >
                {(props) => (
                  <span
                    {...props}
                    css={css`
                      position: absolute;
                    `}
                  >
                    <Spinner size="xlarge" />
                  </span>
                )}
              </FadeIn>
            )}
          </ExitingPersistence>
        </React.Fragment>
      )}
    </Harness>
  );
}

export default function Example() {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
      `}
    >
      <NotAnimated />
      <Animated />
    </div>
  );
}
