import React from 'react';

import { render } from '@testing-library/react';

import { UNSAFE_Text as Text } from '@atlaskit/ds-explorations';

import SectionMessage, { SectionMessageAction } from '../../index';

const sectionMessageInfoId = 'info-section-message';
const sectionMessageInfoBBId = 'jira';
const sectionMessageInfoJiraId = 'bitbucket';

const sectionMessageWrapperWithTestIds = (
  <SectionMessage
    appearance="information"
    title="Atlassian"
    testId={sectionMessageInfoId}
    actions={[
      <SectionMessageAction
        href="https://www.atlassian.com/software/bitbucket"
        testId={sectionMessageInfoBBId}
      >
        Bitbucket
      </SectionMessageAction>,
      <SectionMessageAction
        href="https://www.atlassian.com/software/jira"
        testId={sectionMessageInfoJiraId}
      >
        Jira
      </SectionMessageAction>,
    ]}
  >
    <Text>
      Atlassian provides the tools to help every team unleash their full
      potential.
    </Text>
    <Text>Bitbucket:</Text>
    <Text>
      Bitbucket is more than just Git code management. Bitbucket gives teams one
      place to plan projects, collaborate on code, test, and deploy.
    </Text>
    <Text>Jira:</Text>
    <Text>The #1 software development tool used by agile teams.</Text>
  </SectionMessage>
);

describe('Section Message should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const { getByTestId } = render(sectionMessageWrapperWithTestIds);
    expect(getByTestId(sectionMessageInfoId)).toBeTruthy();
  });
});
describe('Flag actions should be found by data-testid', () => {
  test('Using getByTestId()', async () => {
    const { getByTestId } = render(sectionMessageWrapperWithTestIds);
    expect(getByTestId(sectionMessageInfoBBId)).toBeTruthy();
    expect(getByTestId(sectionMessageInfoJiraId)).toBeTruthy();
  });
});
