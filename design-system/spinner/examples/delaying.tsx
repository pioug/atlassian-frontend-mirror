/** @jsx jsx */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { css, jsx } from '@emotion/core';

import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/standard-button';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import Select, { ValueType } from '@atlaskit/select';
import { gridSize } from '@atlaskit/theme/constants';

import Spinner from '../src';

const grid: number = gridSize();
type Delays = {
  spinner: number;
  content: number;
};
const DelayContext = React.createContext<Delays>({ spinner: 0, content: 0 });

type Phase = 'stopped' | 'loading' | 'ready';

function Harness({
  children,
  title,
  description,
}: {
  children: (phase: Phase, delays: Delays) => React.ReactElement;
  title: string;
  description: string;
}) {
  const [phase, setPhase] = useState<Phase>('stopped');
  const delays: Delays = useContext(DelayContext);

  useEffect(
    function onPhaseChange() {
      if (phase === 'loading') {
        const id = window.setTimeout(() => setPhase('ready'), delays.content);
        return () => window.clearTimeout(id);
      }
    },
    [delays.content, phase],
  );

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      `}
    >
      <h4>{title}</h4>
      <p
        css={css`
          min-height: 70px;
        `}
      >
        {description}
      </p>
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
        {children(phase, delays)}
      </div>
    </div>
  );
}

function Basic() {
  return (
    <Harness title="Default" description="No fadeout of spinner">
      {(phase: Phase, delays: Delays) => (
        <React.Fragment>
          {phase === 'ready' && <Avatar size="xlarge" />}
          {phase === 'loading' && (
            <span
              css={css`
                position: absolute;
              `}
            >
              <Spinner size="xlarge" delay={delays.spinner} />
            </span>
          )}
        </React.Fragment>
      )}
    </Harness>
  );
}

function CrossFade() {
  return (
    <Harness
      title="Cross fade"
      description="Cross fading out the spinners exit with content"
    >
      {(phase: Phase, delays: Delays) => (
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
              <FadeIn>
                {(props) => (
                  <span
                    {...props}
                    css={css`
                      position: absolute;
                    `}
                  >
                    <Spinner size="xlarge" delay={delays.spinner} />
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

type Option = { value: string; label: string };

const contentDelayOptions: Option[] = [
  { value: '10', label: 'Content load time: tiny (10ms)' },
  { value: '50', label: 'Content load time: small (50ms)' },
  { value: '100', label: 'Content load time: medium (100ms)' },
  { value: '500', label: 'Content load time: long (500ms)' },
  { value: '2000', label: 'Content load time: super long (2000ms)' },
];
const defaultContentDelay: Option = contentDelayOptions[1];

const spinnerDelayOptions: Option[] = [
  { value: '0', label: 'Spinner delay: none (default)' },
  { value: '100', label: 'Spinner delay: too short (100ms)' },
  { value: '500', label: 'Spinner delay: medium (500ms)' },
  { value: '1000', label: 'Spinner delay: long (1000ms)' },
];
const defaultSpinnerDelay: Option = spinnerDelayOptions[0];

function Example() {
  const [contentDelay, setContentDelay] = useState(
    Number(defaultContentDelay.value),
  );
  const onContentDelayChange = useCallback((result: ValueType<Option>) => {
    if (result != null && !Array.isArray(result)) {
      // doing a cast to Option as Array.isArray is not narrowing the type
      setContentDelay(Number((result as Option).value));
    }
  }, []);

  const [spinnerDelay, setSpinnerDelay] = useState(
    Number(defaultContentDelay.value),
  );
  const onSpinnerDelayChange = useCallback((result: ValueType<Option>) => {
    if (result != null && !Array.isArray(result)) {
      // doing a cast to Option as Array.isArray is not narrowing the type
      setSpinnerDelay(Number((result as Option).value));
    }
  }, []);

  const delay: Delays = useMemo(
    () => ({
      content: contentDelay,
      spinner: spinnerDelay,
    }),
    [contentDelay, spinnerDelay],
  );

  return (
    <DelayContext.Provider value={delay}>
      <div
        css={css`
          display: flex;
          margin: 0 auto;
          align-items: center;
          flex-direction: column;

          > * {
            margin-top: ${grid}px;
            width: 300px;
          }
        `}
      >
        <Select
          options={contentDelayOptions}
          defaultValue={defaultContentDelay}
          onChange={onContentDelayChange}
        />
        <Select
          options={spinnerDelayOptions}
          defaultValue={defaultSpinnerDelay}
          onChange={onSpinnerDelayChange}
        />
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(0, 300px));
          justify-content: center;
          margin-top: ${grid * 4}px;
        `}
      >
        <Basic />
        <CrossFade />
      </div>
    </DelayContext.Provider>
  );
}

export default () => <Example />;
