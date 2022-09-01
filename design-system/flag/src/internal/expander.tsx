/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { ExitingPersistence, FadeIn } from '@atlaskit/motion';
import { gridSize as getGridSize } from '@atlaskit/theme/constants';

type ExpanderProps = {
  isExpanded: boolean;
  testId?: string;
};

const gridSize = getGridSize();
const paddingLeft = gridSize * 5;

const expanderStyles = css({
  display: 'flex',
  minWidth: 0,
  maxHeight: 0,
  padding: `0 0 0 ${paddingLeft}px`,
  justifyContent: 'center',
  flex: '1 1 100%',
  flexDirection: 'column',
  transition: `max-height 0.3s`,
});

const expandedStyles = css({
  maxHeight: 150,
});

const Expander: FC<ExpanderProps> = ({ children, isExpanded, testId }) => {
  // Need to always render the ExpanderInternal otherwise the
  // reveal transition doesn't happen. We can't use CSS animation for
  // the the reveal because we don't know the height of the content.

  return (
    <div
      aria-hidden={!isExpanded}
      css={[expanderStyles, isExpanded && expandedStyles]}
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

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Expander;
