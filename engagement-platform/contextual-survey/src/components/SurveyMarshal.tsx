/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';
import { Transition } from 'react-transition-group';

import { layers } from '@atlaskit/theme/constants';

import { surveyInnerWidth, surveyOffset } from '../constants';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const animationDuration: number = 300;
const offscreen = {
  translateX: `${surveyInnerWidth + surveyOffset}px`,
  opacity: '0',
};

const getAnimationProps = (state: TransitionState) => {
  switch (state) {
    case 'entering': {
      return offscreen;
    }
    case 'entered': {
      return {
        translateX: '0',
        opacity: '1',
      };
    }

    case 'exited':
    case 'exiting': {
      return offscreen;
    }
  }
};

type Props = {
  /** Whether the form should be rendered */
  shouldShow: boolean;
  /** A function that returns Node to be rendered (`<ContextualSurvey/>`)
   * Using a function as child so that the child node does
   * not need to be evaluated if it is not mounted
   */
  children: () => ReactNode;
};

export default function SurveyMarshal(props: Props) {
  const { children, shouldShow } = props;

  return (
    <Transition in={shouldShow} timeout={animationDuration} unmountOnExit>
      {(state: TransitionState) => {
        const { translateX, opacity } = getAnimationProps(state);

        return (
          <div
            css={css`
              position: fixed;
              right: ${surveyOffset}px;
              bottom: ${surveyOffset}px;
              z-index: ${layers.flag()};
              transform: translateX(${translateX});
              opacity: ${opacity};
              transition: all ${animationDuration}ms ease-in-out;
              transition-property: transform, opacity;
            `}
          >
            {children()}
          </div>
        );
      }}
    </Transition>
  );
}
