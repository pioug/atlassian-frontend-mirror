/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import AkBlanket from '@atlaskit/blanket';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import { layers } from '@atlaskit/theme/constants';

import { animationTimingFunction, transitionDurationMs } from '../constants';

type BlanketProps = {
  isOpen: boolean;
  onBlanketClicked: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  testId?: string;
};

/**
 * The FadeIn opacity transition creates a new stacking context so we need ensure layering is the same as @atlaskit/blanket
 */
const stackingStyles = css({
  position: 'relative',
  zIndex: layers.blanket(),
});

/**
 * A wrapper around `@atlaskit/blanket` that adds a fade in/out transition.
 */
const Blanket = ({ isOpen, onBlanketClicked, testId }: BlanketProps) => {
  return (
    <ExitingPersistence appear>
      {isOpen && (
        <FadeIn
          /**
           * We double the duration because the fade in keyframes have
           * `opacity: 1` at `50%`.
           *
           * The fade out animation uses half the passed duration so it evens out.
           */
          duration={transitionDurationMs * 2}
          /**
           * We don't expose this on `FadeIn` but it does get passed down.
           * TODO: figure out how we want to handle this...
           */
          // @ts-ignore
          animationTimingFunction={animationTimingFunction}
        >
          {({ className }) => (
            <div className={className} css={stackingStyles}>
              <AkBlanket
                isTinted
                onBlanketClicked={onBlanketClicked}
                testId={testId && testId}
              />
            </div>
          )}
        </FadeIn>
      )}
    </ExitingPersistence>
  );
};

export default Blanket;
