import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, Flex, xcss } from '@atlaskit/primitives';

type EmptyStateProps = {
  header: string;
  testId?: string;
  description?: React.ReactNode;
  renderImage?: () => React.ReactNode;
};

export const EmptyState = ({
  testId,
  header,
  description,
  renderImage,
}: EmptyStateProps) => {
  return (
    <Flex
      xcss={xcss({
        marginBlockStart: 'space.600',
        marginBlockEnd: 'space.600',
        textAlign: 'center',
      })}
      testId={testId}
      direction="column"
      alignItems="center"
      gap="space.100"
    >
      {renderImage?.()}
      <Heading variant="medium">{header}</Heading>
      {description && (
        <Box as="p" color={'color.text'}>
          {description}
        </Box>
      )}
    </Flex>
  );
};
