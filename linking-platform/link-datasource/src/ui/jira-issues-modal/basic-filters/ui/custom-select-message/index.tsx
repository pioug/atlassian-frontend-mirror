import React from 'react';

import { FormattedMessage } from 'react-intl-next';

import Heading from '@atlaskit/heading';
import { Flex, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

const boxStyles = xcss({
  height: token('space.800', '64px'),
  marginBottom: token('space.200', '16px'),
});

interface CustomSelectMessageProps {
  icon: React.ReactNode;
  message: object;
  testId: string;
}

const CustomSelectMessage = ({
  icon,
  message,
  testId,
}: CustomSelectMessageProps) => {
  return (
    <Stack testId={testId}>
      <Flex xcss={boxStyles} alignItems="center" justifyContent="center">
        {icon}
      </Flex>
      <Heading level="h400">
        <FormattedMessage {...message} />
      </Heading>
    </Stack>
  );
};

export default CustomSelectMessage;
