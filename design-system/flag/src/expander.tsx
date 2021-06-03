/** @jsx jsx */
import { ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import { gridSize } from '@atlaskit/theme/constants';

type Props = {
  children: ReactNode;
  isExpanded: boolean;
  testId?: string;
};

const paddingLeft = gridSize() * 5;

const Expander = ({ children, isExpanded, testId }: Props) => {
  // Need to always render the ExpanderInternal otherwise the
  // reveal transition doesn't happen. We can't use CSS animation for
  // the the reveal because we don't know the height of the content.

  return (
    <div
      aria-hidden={!isExpanded}
      css={css`
        max-height: ${isExpanded ? 150 : 0}px;
        transition: max-height 0.3s;
        display: flex;
        flex: 1 1 100%;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        padding: 0 0 0 ${paddingLeft}px;
      `}
      data-testid={testId && `${testId}-expander`}
    >
      <ExitingPersistence appear>
        {isExpanded && (
          <FadeIn>{(props) => <div {...props}>{children}</div>}</FadeIn>
        )}
      </ExitingPersistence>
    </div>
  );
};

export default Expander;
