/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState } from 'react';

import { Appearance } from '@atlaskit/button/types';
import Button from '@atlaskit/button/custom-theme-button';
import { ActionIcon } from './ActionIcon';

export interface ActionProps {
  /* Id of the action for use by ??? */
  id: string;
  /* The text to be displayed in the action's button */
  text: React.ReactNode;
  /* The function to be called on clicking the action. This is a promise so the state can transition correctly after the action finishes */
  promise: () => Promise<any>;
  /* The atlaskit button style to use in showing the action. This is the only button prop you have access to. */
  buttonAppearance?: Appearance;
}

export type ActionState = 'init' | 'loading' | 'success' | 'failure';

export const spinnerDelay = 1000;
export const Action = ({
  promise,
  text,
  buttonAppearance = 'default',
  id,
}: ActionProps) => {
  const [state, setState] = useState<ActionState>('init');

  return (
    <Button
      spacing="compact"
      appearance={buttonAppearance}
      isLoading={state === 'loading'}
      testId={`button-${id}`}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        if (state !== 'loading') {
          setState('loading');
          promise()
            .then(() => {
              setState('success');
              setTimeout(() => setState('init'), spinnerDelay);
            })
            .catch(() => {
              setState('failure');
              setTimeout(() => setState('init'), spinnerDelay);
            });
        }
      }}
    >
      <div
        css={{
          transition: 'opacity 0.3s',
          opacity: state !== 'init' ? 0 : 1,
        }}
      >
        {text}
      </div>
      <ActionIcon state={state} />
    </Button>
  );
};
