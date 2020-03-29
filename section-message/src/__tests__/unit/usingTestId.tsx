import { render } from '@testing-library/react';
import React from 'react';

import SectionMessage from '../..';

const sectionMessageInfoId = 'info-section-message';
const sectionMessageInfoBBId = 'jira';
const sectionMessageInfoJiraId = 'bitbucket';

const sectionMessageWrapperWithTestIds = (
  <SectionMessage
    appearance="info"
    title="Atlassian"
    testId={sectionMessageInfoId}
    actions={[
      {
        key: 'bitbucket',
        href: 'https://www.atlassian.com/software/bitbucket',
        text: 'Bitbucket',
        testId: sectionMessageInfoBBId,
      },
      {
        key: 'jira',
        href: 'https://www.atlassian.com/software/jira',
        text: 'Jira',
        testId: sectionMessageInfoJiraId,
      },
    ]}
  >
    <p>
      Atlassian provides the tools to help every team unleash their full
      potential.
    </p>
    <p />
    <b>Bitbucket:</b>
    <p>
      Bitbucket is more than just Git code management. Bitbucket gives teams one
      place to plan projects, collaborate on code, test, and deploy.
    </p>
    <p />
    <b>Jira:</b>
    <p>The #1 software development tool used by agile teams.</p>
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
