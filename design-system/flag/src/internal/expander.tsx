import React from 'react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import Stack from '@atlaskit/primitives/stack';
import { ExitingPersistence, FadeIn } from '@atlaskit/motion';

type ExpanderProps = {
  isExpanded: boolean;
  testId?: string;
  children: React.ReactNode;
};

const Expander = ({ children, isExpanded, testId }: ExpanderProps) => {
  // Need to always render the ExpanderInternal otherwise the
  // reveal transition doesn't happen. We can't use CSS animation for
  // the the reveal because we don't know the height of the content.

  return (
    <Box
      UNSAFE_style={{
        minWidth: 0,
        maxHeight: isExpanded ? 150 : 0,
        flex: '1 1 100%',
        transition: `max-height 0.3s`,
      }}
      aria-hidden={!isExpanded}
      testId={testId && `${testId}-expander`}
    >
      <ExitingPersistence appear>
        {isExpanded && (
          <FadeIn>
            {(props) => (
              <Box display="block" UNSAFE_style={{ width: '100%' }} {...props}>
                <Stack space="space.100">{children}</Stack>
              </Box>
            )}
          </FadeIn>
        )}
      </ExitingPersistence>
    </Box>
  );
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Expander;
