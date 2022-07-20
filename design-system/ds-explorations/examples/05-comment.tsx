/** @jsx jsx */
import { jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';

import Box from '../src/components/box.partial';
import Inline from '../src/components/inline';
import Stack from '../src/components/stack';
import Text from '../src/components/text.partial';

const Author = ({ children }: any) => {
  return <Text fontWeight={500}>{children}</Text>;
};

const Date = ({ children }: any) => {
  return <Text>{children}</Text>;
};

const EditIndicator = ({ hasBeenEdited }: any) => {
  return hasBeenEdited ? <Text color="subtlest">Edited</Text> : null;
};

const CommentAction = ({ children }: any) => {
  return <Text fontWeight={500}>{children}</Text>;
};

export default () => {
  return (
    <Box>
      <Stack gap="sp-50">
        <Inline gap="sp-100" alignItems="center">
          <Author>Anthony Roberts</Author>
          <Lozenge>Author</Lozenge>
          <Date>Jun 15, 2022</Date>
          <EditIndicator hasBeenEdited />
        </Inline>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </Text>
        <Box color="subtle">
          <Inline gap="sp-100" separator="·">
            <CommentAction>Reply</CommentAction>
            <CommentAction>Edit</CommentAction>
            <CommentAction>Like</CommentAction>
          </Inline>
        </Box>
      </Stack>
    </Box>
  );
};
