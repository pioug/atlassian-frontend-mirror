/** @jsx jsx */
import { Ref } from 'react';

import { jsx } from '@emotion/core';

import { Direction, easeOut, SlideIn } from '@atlaskit/motion';

interface ChildrenAsFunctionProps {
  'data-enter-from': string;
  'data-exit-to': string;
  'data-testid'?: string;
  className?: string;
  ref: Ref<any>;
}

interface NestingMotionProps {
  enterFrom: Direction;
  exitTo: Direction;
  children: (props: ChildrenAsFunctionProps) => React.ReactNode;
  testId?: string;
}

export const NestingMotion = (props: NestingMotionProps) => {
  const { children, enterFrom, exitTo, testId } = props;
  return (
    <SlideIn
      exitTo={exitTo}
      enterFrom={enterFrom}
      animationTimingFunction={(_) => easeOut}
    >
      {(innerProps, direction) =>
        children({
          'data-enter-from': enterFrom,
          'data-exit-to': exitTo,
          'data-testid': testId && `${testId}-${direction}`,
          ...innerProps,
        })
      }
    </SlideIn>
  );
};
