import React from 'react';

import {
  UNSAFE_Box as Box,
  UNSAFE_Stack as Stack,
  UNSAFE_Text as Text,
} from '@atlaskit/ds-explorations';

import SectionMessage, { SectionMessageAction } from '../src';

const Example = () => (
  <Box display="block" padding="space.100">
    <Stack gap="space.200">
      <SectionMessage
        appearance="information"
        title="Atlassian"
        testId="info-section-message"
        actions={[
          <SectionMessageAction href="#hiAtlassianBitbucket" testId="bitbucket">
            Bitbucket
          </SectionMessageAction>,
          <SectionMessageAction href="#hiAtlassianJira" testId="jira">
            Jira
          </SectionMessageAction>,
        ]}
      >
        <Stack gap="space.100">
          <Text>
            Atlassian provides the tools to help every team unleash their full
            potential.
          </Text>

          <Text fontWeight="bold">Bitbucket:</Text>
          <Text>
            Bitbucket is more than just Git code management. Bitbucket gives
            teams one place to plan projects, collaborate on code, test, and
            deploy.
          </Text>

          <Text fontWeight="bold">Jira:</Text>
          <Text>The #1 software development tool used by agile teams.</Text>
        </Stack>
      </SectionMessage>
      <SectionMessage
        appearance="error"
        testId="error-section-message"
        actions={
          <SectionMessageAction href="https://about.google/" testId="google">
            Google
          </SectionMessageAction>
        }
      >
        <Stack gap="space.100">
          <Text fontWeight="bold">Google:</Text>
          <Text>
            Our mission is to organise the world’s information and make it
            universally accessible and useful.
          </Text>
        </Stack>
      </SectionMessage>
      <SectionMessage
        title="this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues"
        testId="overflow-section-message"
      >
        <Text>
          this/is/a/really/long/path/to/a/file/to/test/if/the/section/message/component/will/correctly/wrap/words/onto/new/lines/to/prevent/the/text/overflowing/the/component/which/causes/display/issues
        </Text>
      </SectionMessage>
      <SectionMessage
        title="Testing actions overflow"
        testId="overflow-actions-section-message"
        actions={[
          <SectionMessageAction href="#1">Action 1</SectionMessageAction>,
          <SectionMessageAction href="#2">Action 2</SectionMessageAction>,
          <SectionMessageAction href="#3">Action 3</SectionMessageAction>,
          <SectionMessageAction href="#4">Action 4</SectionMessageAction>,
          <SectionMessageAction href="#5">Action 5</SectionMessageAction>,
          <SectionMessageAction href="#6">Action 6</SectionMessageAction>,
          <SectionMessageAction href="#7">Action 7</SectionMessageAction>,
          <SectionMessageAction href="#8">Action 8</SectionMessageAction>,
          <SectionMessageAction href="#9">Action 9</SectionMessageAction>,
          <SectionMessageAction href="#10">Action 10</SectionMessageAction>,
          <SectionMessageAction href="#11">Action 11</SectionMessageAction>,
          <SectionMessageAction href="#12">Action 12</SectionMessageAction>,
          <SectionMessageAction href="#13">Action 13</SectionMessageAction>,
          <SectionMessageAction href="#14">Action 14</SectionMessageAction>,
          <SectionMessageAction href="#15">Action 15</SectionMessageAction>,
          <SectionMessageAction href="#16">Action 16</SectionMessageAction>,
          <SectionMessageAction href="#17">Action 17</SectionMessageAction>,
          <SectionMessageAction href="#18">Action 18</SectionMessageAction>,
          <SectionMessageAction href="#19">Action 19</SectionMessageAction>,
          <SectionMessageAction href="#20">Action 20</SectionMessageAction>,
        ]}
      >
        <Text>
          This Section Message has lots of actions. This is a test to ensure
          they don't overflow
        </Text>
      </SectionMessage>
    </Stack>
  </Box>
);

export default Example;
