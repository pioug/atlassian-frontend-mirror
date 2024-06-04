import React from 'react';

import Heading from '@atlaskit/heading';
import { Box, xcss } from '@atlaskit/primitives';
import {token} from "@atlaskit/tokens";

type EmptyStateProps = {
  header: string;
  testId?: string;
  description?: React.ReactNode;
  renderImage?: () => React.ReactNode;
};

const emptyStateStyles = xcss({
  alignItems: "center",
  display: 'flex',
  flexDirection: 'column',
  gap: "space.100",
  height: '100%',
  justifyContent: 'center',
  marginLeft: 'space.300',
  marginRight: 'space.300',
  textAlign: 'center',
})
const descriptionStyles = xcss({
  marginTop: token('space.0', '0px'),
  marginBottom: token('space.300', '24px'),
  color: 'color.text',
});

export const EmptyState = ({
                             testId,
                             header,
                             description,
                             renderImage,
                           }: EmptyStateProps) => {
  return (
    <Box xcss={emptyStateStyles} testId={testId}>
      {renderImage?.()}
      <Heading size="small">{header}</Heading>
      {description && (
        <Box as="p" xcss={descriptionStyles}>
          {description}
        </Box>
      )}
    </Box>
  );
};
